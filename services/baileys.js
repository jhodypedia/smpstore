const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
let sock, lastQR, lastPairing;

async function initBaileys() {
  const { state, saveCreds } = await useMultiFileAuthState('./wa_auth');
  const { version } = await fetchLatestBaileysVersion();
  sock = makeWASocket({
    auth: state,
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false
  });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u) => {
    if (u.qr) lastQR = u.qr;
    if (u.pairingCode) lastPairing = u.pairingCode;
    const { connection } = u;
    console.log('[WA]', connection || '');
  });
  return sock;
}
async function requireSock() { if (!sock) await initBaileys(); return sock; }
async function getQrCode() { await requireSock(); return lastQR || null; }
async function getPairingCode() { await requireSock(); return lastPairing || null; }
async function sendWa(to, text) {
  const s = await requireSock();
  const jid = `${(to+'').replace(/\D/g,'')}@s.whatsapp.net`;
  await s.sendMessage(jid, { text });
}
module.exports = { initBaileys, getQrCode, getPairingCode, sendWa };
