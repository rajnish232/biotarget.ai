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

// Backwards-compatible verify & auto-migration helper
export function verifyUserPassword(user, inputPassword) {
  if (!user || !inputPassword) return false;

  const trimmedInput = inputPassword.trim();

  // 1. Standard PBKDF2 Salted Hash verification
  if (user.salt && user.passwordHash) {
    const { hash } = hashPassword(trimmedInput, user.salt);
    if (hash === user.passwordHash) return true;
  }

  // 2. Legacy account verification with auto-migration to PBKDF2
  if (user.password && user.password === trimmedInput) {
    // Migrate legacy plain text user to salted PBKDF2 hash on the fly!
    const { salt, hash } = hashPassword(trimmedInput);
    user.salt = salt;
    user.passwordHash = hash;

    const db = readDb();
    const dbUser = db.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (dbUser) {
      dbUser.salt = salt;
      dbUser.passwordHash = hash;
      writeDb(db);
    }
    return true;
  }

  return false;
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
  if (!email) return null;
  const db = readDb();
  const cleanEmail = email.trim().toLowerCase();
  return db.users.find(u => u.email.trim().toLowerCase() === cleanEmail);
}

export function createUser(email, password, orgName) {
  const db = readDb();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  const exists = db.users.find(u => u.email.trim().toLowerCase() === cleanEmail);
  if (exists) return null;

  const { salt, hash } = hashPassword(cleanPass);

  const newUser = {
    email: cleanEmail,
    password: cleanPass, // Saved for fallback compatibility
    salt: salt,
    passwordHash: hash,
    orgName: orgName ? orgName.trim() : "Global BioTech Lab",
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
  const cleanEmail = email.trim().toLowerCase();
  let user = db.users.find(u => u.email.trim().toLowerCase() === cleanEmail);

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
  if (!email) return [];
  const db = readDb();
  const cleanEmail = email.trim().toLowerCase();
  return db.savedTargets.filter(t => t.email.trim().toLowerCase() === cleanEmail);
}

export function saveTarget(email, targetData) {
  const db = readDb();
  
  const cleanEmail = email.trim().toLowerCase();
  const cleanSymbol = targetData.geneSymbol.trim().toUpperCase();

  const exists = db.savedTargets.some(
    t => t.email.trim().toLowerCase() === cleanEmail && t.geneSymbol.toUpperCase() === cleanSymbol
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
  const cleanEmail = email.trim().toLowerCase();
  const cleanSymbol = symbol.trim().toUpperCase();

  db.savedTargets = db.savedTargets.filter(
    t => !(t.email.trim().toLowerCase() === cleanEmail && t.geneSymbol.toUpperCase() === cleanSymbol)
  );
  
  writeDb(db);
  return true;
}
