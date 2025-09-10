const nodemailer = require('nodemailer');
const { sendWa } = require('./baileys');
require('dotenv').config();

const mailer = process.env.MAIL_USER ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
}) : null;

async function sendEmail(to, subject, html) {
  if (!mailer || !to) return;
  await mailer.sendMail({ from: process.env.MAIL_USER, to, subject, html });
}

exports.notifyPending = async (o) => {
  const { contact_wa, email, store, amount, qr_image, reff_id } = o;
  const text = `Menunggu Pembayaran\nRef: ${reff_id}\nNominal: Rp${amount}\nQR: ${qr_image}`;
  if (contact_wa) await sendWa(contact_wa, `[${store}] ${text}`);
  if (email) await sendEmail(email, `[${store}] Menunggu Pembayaran`, `<p>${text}</p><img src="${qr_image}"/>`);
};
exports.notifyPaid = async (o) => {
  const { contact_wa, email, store, reff_id } = o;
  const text = `Pembayaran diterima ✅\nRef: ${reff_id}\nAdmin akan memproses chip.`;
  if (contact_wa) await sendWa(contact_wa, `[${store}] ${text}`);
  if (email) await sendEmail(email, `[${store}] Pembayaran Diterima`, `<p>${text}</p>`);
};
exports.notifySuccess = async (o) => {
  const { contact_wa, email, store, reff_id } = o;
  const text = `Order selesai ✅\nRef: ${reff_id}\nChip sudah dikirim.`;
  if (contact_wa) await sendWa(contact_wa, `[${store}] ${text}`);
  if (email) await sendEmail(email, `[${store}] Order Selesai`, `<p>${text}</p>`);
};
exports.notifyFailed = async (o) => {
  const { contact_wa, email, store, reff_id } = o;
  const text = `Order gagal ❌\nRef: ${reff_id}\nSilakan hubungi admin.`;
  if (contact_wa) await sendWa(contact_wa, `[${store}] ${text}`);
  if (email) await sendEmail(email, `[${store}] Order Gagal`, `<p>${text}</p>`);
};
