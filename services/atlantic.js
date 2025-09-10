const axios = require('axios');
const md5 = require('md5');
require('dotenv').config();

const ATL_BASE_URL = process.env.ATL_BASE_URL;
const API_KEY = process.env.ATL_API_KEY;
const ATL_USERNAME = process.env.ATL_USERNAME;

exports.createDeposit = async ({ reff_id, nominal, type, method }) => {
  const url = `${ATL_BASE_URL}/deposit/create`;
  const params = new URLSearchParams();
  params.append('api_key', API_KEY);
  params.append('reff_id', reff_id);
  params.append('nominal', nominal);
  params.append('type', type);     // "ewallet"
  params.append('method', method); // "qris"
  const { data } = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return data;
};

exports.verifyWebhook = (headers) => {
  const sig = headers['x-atl-signature'] || headers['X-ATL-Signature'] || '';
  return sig === md5(ATL_USERNAME || '');
};
