// engine/src/session.js
const store = {};
export async function getSession(id) { return store[id] || {}; }
export async function saveSession(id, session) { store[id] = session; }
