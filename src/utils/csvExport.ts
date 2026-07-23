import type { BioTargetData } from "../services/api";
import type { TargetAnalysis } from "../services/ai";

export function exportTargetToCSV(data: BioTargetData, analysis: TargetAnalysis | null) {
  const rows: Array<[string, string]> = [
    ["REPORT METADATA", ""],
    ["Gene Symbol", data.geneSymbol],
    ["Full Gene Name", data.fullName],
    ["UniProt Accession ID", data.uniprotId],
    ["Ensembl Gene ID", data.ensemblId],
    ["Generated Timestamp", new Date().toISOString()],
    ["", ""],
    ["TARGET FEASIBILITY & TRACTABILITY", ""],
    ["Feasibility Score (0-100)", analysis ? `${analysis.feasibilityScore}/100` : "N/A"],
    ["Tractability Class", analysis ? analysis.tractabilityClass : "N/A"],
    ["Safety Risk Level", analysis ? analysis.safetyProfile.riskLevel : "N/A"],
    ["Subcellular Location", data.subcellularLocation.join(" | ")],
    ["Pathways", data.pathways.join(" | ")],
    ["", ""],
    ["CRISPR DEPMAP ESSENTIALITY", ""],
    ["Chronos Dependency Score", `${data.depMap.dependencyScore}`],
    ["Cell Lines Tested", `${data.depMap.cellLinesTested}`],
    ["Top Dependent Tissue", data.depMap.topDependentTissue],
    ["", ""],
    ["LEAD BIOACTIVE COMPOUNDS (ChEMBL)", ""],
    ...data.compounds.map((c, i) => [
      `Compound #${i + 1}`,
      `${c.name} (${c.chemblId}) - Type: ${c.type} - Value: ${c.value} ${c.unit}`
    ] as [string, string]),
    ["", ""],
    ["CLINICAL TRIALS (ClinicalTrials.gov)", ""],
    ...data.clinicalTrials.map((t, i) => [
      `Trial #${i + 1}`,
      `${t.nctId} - ${t.title} [Phase: ${t.phase}, Status: ${t.status}]`
    ] as [string, string]),
    ["", ""],
    ["PATENT & FREEDOM-TO-OPERATE (FTO)", ""],
    ["Patent Count", `${data.patents.patentCount}`],
    ["FTO Risk Level", data.patents.ftoStatus],
    ["Primary Assignees", data.patents.primaryAssignees.join(" | ")],
    ["", ""],
    ["CORE LITERATURE CITATIONS (PubMed)", ""],
    ...data.articles.map((a, i) => [
      `Article #${i + 1}`,
      `${a.title} (PMID: ${a.pmid}, ${a.pubDate})`
    ] as [string, string]),
    ["", ""],
    ["AI CLINICAL SYNTHESIS REPORT", ""],
    ["Clinical Summary", analysis ? `"${analysis.clinicalSummary.replace(/"/g, '""')}"` : "N/A"]
  ];

  const csvContent = rows
    .map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${data.geneSymbol}_Target_Validation_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
