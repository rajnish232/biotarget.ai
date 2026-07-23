import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { aggregateTarget } from "./aggregator.js";
import { 
  findUserByEmail, 
  createUser, 
  getSavedTargets, 
  saveTarget, 
  removeTarget 
} from "./database.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: "*" })); // Allow access from our Vite frontend
app.use(express.json());

// 1. Status Connection Route
app.get("/api/status", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "";
  res.json({
    status: "online",
    hasApiKey: hasKey
  });
});

// 2. User Authentication: Signup Route
app.post("/api/auth/signup", (req, res) => {
  const { email, password, orgName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password fields are required." });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  const user = createUser(email, password, orgName);
  if (!user) {
    return res.status(500).json({ error: "Could not create user profile. Please try again." });
  }

  res.json({
    email: user.email,
    orgName: user.orgName
  });
});

// 3. User Authentication: Login Route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password fields are required." });
  }

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid email credentials or incorrect password." });
  }

  res.json({
    email: user.email,
    orgName: user.orgName
  });
});

// 4. Saved Target Pipelines: Fetch bookmarks
app.get("/api/pipeline/:email", (req, res) => {
  const email = req.params.email;
  if (!email) {
    return res.status(400).json({ error: "Account email parameter is required." });
  }
  const targets = getSavedTargets(email);
  res.json(targets);
});

// 5. Saved Target Pipelines: Save bookmark
app.post("/api/pipeline", (req, res) => {
  const { email, targetData } = req.body;
  if (!email || !targetData || !targetData.geneSymbol) {
    return res.status(400).json({ error: "Account email and target dataset are required." });
  }

  const ok = saveTarget(email, targetData);
  if (ok) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: "Could not write target bookmark to the database." });
  }
});

// 6. Saved Target Pipelines: Delete bookmark
app.delete("/api/pipeline/:email/:symbol", (req, res) => {
  const { email, symbol } = req.params;
  if (!email || !symbol) {
    return res.status(400).json({ error: "Account email and target gene symbol are required." });
  }

  const ok = removeTarget(email, symbol);
  if (ok) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: "Could not delete target bookmark from the database." });
  }
});

// 7. Live Target Data Aggregator Route
app.get("/api/target/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  if (!symbol || symbol.trim() === "") {
    return res.status(400).json({ error: "Gene symbol parameter is required." });
  }

  try {
    const data = await aggregateTarget(symbol);
    res.json(data);
  } catch (error) {
    console.error(`[Backend] Live aggregation failed for ${symbol}:`, error.message);
    res.status(500).json({ error: `Failed to compile live databases: ${error.message}` });
  }
});

// 8. Secure Proxy Target Analysis Route
app.post("/api/analyze", async (req, res) => {
  const data = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return res.status(500).json({ 
      error: "Gemini API Key is not configured on the backend server .env file." 
    });
  }

  const prompt = `
  You are an expert AI bioinformatician and clinical trial strategist. 
  You are generating a Target Validation & Feasibility Report for the gene/protein "${data.geneSymbol}" (Full Name: "${data.fullName}").
  
  Here is the collected scientific database profile:
  - UniProt ID: ${data.uniprotId}
  - Ensembl Gene ID: ${data.ensemblId}
  - UniProt Function: ${data.functionSummary}
  - Subcellular Location: ${data.subcellularLocation?.join(", ") || "Unknown"}
  - Pathways: ${data.pathways?.join(", ") || "Unknown"}
  - Associated Diseases (from OpenTargets): ${JSON.stringify(data.diseases || [])}
  - Bioactive Compounds (from ChEMBL target: ${data.chemblId}): ${JSON.stringify(data.compounds || [])}
  - Clinical Trials Registry (from ClinicalTrials.gov): ${JSON.stringify(data.clinicalTrials || [])}
  - Patent & FTO Landscaping: ${JSON.stringify(data.patents || [])}
  - Core Literature (from PubMed): ${JSON.stringify(data.articles || [])}
  
  Synthesize this scientific data and generate a detailed feasibility analysis in JSON format matching this TypeScript interface:
  
  interface TargetAnalysis {
    feasibilityScore: number; // 0 to 100
    tractabilityClass: string; // e.g. "Highly Druggable (Small Molecule / Antibody)"
    clinicalSummary: string; // A highly professional 4-5 sentence summary synthesizing the data. MUST ground statements with bracketed citations, using exactly the formats: [UniProt:ID], [ChEMBL:ID], [OpenTargets:ID], [PMID:ID], and [NCT:ID] based on the input values!
    therapeuticModalities: Array<{ 
      modality: string; 
      feasibility: "High" | "Medium" | "Low"; 
      description: string; // Detail modal feasibility, incorporating source grounding references (e.g. [ChEMBL:ID], [UniProt:ID], or [Ensembl:ID]) where appropriate.
    }>;
    safetyProfile: {
      riskLevel: "Low" | "Medium" | "High";
      warnings: string[]; // Specific warnings related to targeted inhibition, incorporating source citations.
      offTargetTissues: string[]; // Tissues prone to side-effects.
    };
    recommendedNextSteps: string[]; // Detailed actionable next steps for a wet-lab team, referencing targets, patents (assignees), and citations (e.g. [OpenTargets:ID] or [NCT:ID]).
  }
  
  Provide ONLY valid JSON. Do not include markdown code block formatting or explanation.
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google API responded with error: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    const responseText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (responseText) {
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    }
    throw new Error("Empty content in Gemini candidates response.");
  } catch (error) {
    console.error("Backend proxy analysis failed:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`[BioTarget Backend] Secure service running at http://localhost:${PORT}`);
  console.log(`[BioTarget Backend] Access Endpoint: http://localhost:${PORT}/api/status`);
});
