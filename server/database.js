import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

// Read database helper
export function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      const initial = { users: [], savedTargets: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Database read failure:", e);
    return { users: [], savedTargets: [] };
  }
}

// Write database helper
export function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error("Database write failure:", e);
    return false;
  }
}

// User query database methods
export function findUserByEmail(email) {
  const db = readDb();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email, password, orgName) {
  const db = readDb();
  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return null;

  const newUser = {
    email: email.toLowerCase(),
    password: password, // Store password securely for demo environment
    orgName: orgName || "Global BioTech Lab",
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

// Saved targets database methods
export function getSavedTargets(email) {
  const db = readDb();
  return db.savedTargets.filter(t => t.email.toLowerCase() === email.toLowerCase());
}

export function saveTarget(email, targetData) {
  const db = readDb();
  
  const cleanEmail = email.toLowerCase();
  const cleanSymbol = targetData.geneSymbol.trim().toUpperCase();

  const exists = db.savedTargets.some(
    t => t.email.toLowerCase() === cleanEmail && t.geneSymbol.toUpperCase() === cleanSymbol
  );
  if (exists) return true;

  const newBookmark = {
    email: cleanEmail,
    geneSymbol: cleanSymbol,
    fullName: targetData.fullName,
    uniprotId: targetData.uniprotId,
    savedAt: new Date().toISOString()
  };

  db.savedTargets.push(newBookmark);
  writeDb(db);
  return true;
}

export function removeTarget(email, symbol) {
  const db = readDb();
  const cleanEmail = email.toLowerCase();
  const cleanSymbol = symbol.trim().toUpperCase();

  db.savedTargets = db.savedTargets.filter(
    t => !(t.email.toLowerCase() === cleanEmail && t.geneSymbol.toUpperCase() === cleanSymbol)
  );
  
  writeDb(db);
  return true;
}
