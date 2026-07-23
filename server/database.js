import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

// Cryptographic Password Salt & Hash Helper (PBKDF2 SHA-512)
export function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString("hex");
  }
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
}

export function verifyPassword(password, salt, storedHash) {
  if (!salt || !storedHash) return false;
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
}

export function generateSessionToken(email) {
  const payload = `${email}:${Date.now()}:${crypto.randomBytes(8).toString("hex")}`;
  return crypto.createHmac("sha256", "biotarget_secret_key_2026").update(payload).digest("hex");
}

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
  const cleanEmail = email.toLowerCase();
  const exists = db.users.find(u => u.email.toLowerCase() === cleanEmail);
  if (exists) return null;

  const { salt, hash } = hashPassword(password);

  const newUser = {
    email: cleanEmail,
    salt: salt,
    passwordHash: hash,
    orgName: orgName || "Global BioTech Lab",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isGoogleAuth: false
  };

  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function createOrGetGoogleUser(email, name, picture) {
  const db = readDb();
  const cleanEmail = email.toLowerCase();
  let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (user) {
    user.lastLoginAt = new Date().toISOString();
    if (picture) user.picture = picture;
    writeDb(db);
    return user;
  }

  const newUser = {
    email: cleanEmail,
    orgName: name ? `${name}'s Research Lab` : "Google Partner Lab",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isGoogleAuth: true,
    picture: picture || undefined
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
