import fs from 'fs';
import path from 'path';

// Use /tmp/activ-data as fallback if project data dir is not writable
// This ensures the server can always write, even in restricted environments
function getDataDir() {
  const projectData = path.join(process.cwd(), 'data');
  try {
    fs.mkdirSync(projectData, { recursive: true });
    // Test write permission
    const testFile = path.join(projectData, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return projectData;
  } catch {
    // Fallback to /tmp
    const tmpData = path.join('/tmp', 'activ-data');
    fs.mkdirSync(tmpData, { recursive: true });
    console.warn('[db] Using /tmp/activ-data (project data dir not writable)');
    return tmpData;
  }
}

const DATA_DIR = getDataDir();

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }
}

function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  ensureFile(filePath);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[db] Error reading ${filename}:`, err.message);
    return [];
  }
}

function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[db] Error writing ${filename}:`, err.message);
    throw new Error(`Database write failed for ${filename}: ${err.message}`);
  }
}

// ── Bookings ──────────────────────────────────────────────────────────────

export function getAllBookings() {
  return readJSON('bookings.json');
}

export function getBookingById(id) {
  return getAllBookings().find((b) => b._id === id) || null;
}

export function getBookingsByUser(userId) {
  return getAllBookings().filter((b) => b.userId === userId);
}

export function createBooking(booking) {
  const bookings = getAllBookings();
  const newBooking = {
    _id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'pending',         // pending | approved | rejected
    paymentStatus: 'awaiting_proof', // awaiting_proof | proof_submitted | approved | rejected
    paymentMethod: null,       // receipt | instapay | wallet
    proofUrl: null,
    proofFileName: null,
    approvedPrice: null,       // admin sets this on approval
    holdUntil: null,           // admin can set booking hold deadline
    adminNote: null,
    ...booking,
  };
  bookings.push(newBooking);
  writeJSON('bookings.json', bookings);
  return newBooking;
}

export function updateBooking(id, updates) {
  const bookings = getAllBookings();
  const idx = bookings.findIndex((b) => b._id === id);
  if (idx === -1) return null;
  bookings[idx] = {
    ...bookings[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJSON('bookings.json', bookings);
  return bookings[idx];
}

export function deleteBooking(id) {
  const bookings = getAllBookings().filter((b) => b._id !== id);
  writeJSON('bookings.json', bookings);
}

// ── Payments ──────────────────────────────────────────────────────────────

export function getAllPayments() {
  return readJSON('payments.json');
}

export function createPayment(payment) {
  const payments = getAllPayments();
  const newPayment = {
    _id: `py_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...payment,
  };
  payments.push(newPayment);
  writeJSON('payments.json', payments);
  return newPayment;
}

export function updatePayment(id, updates) {
  const payments = getAllPayments();
  const idx = payments.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  payments[idx] = { ...payments[idx], ...updates };
  writeJSON('payments.json', payments);
  return payments[idx];
}

// Expose which dir is being used (useful for debugging)
export function getDataPath() {
  return DATA_DIR;
}
