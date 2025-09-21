import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.warn('GOOGLE_API_KEY is not set. Set it in .env or environment variables.');
}

export async function callGoogleApi(path: string, data?: any) {
  const url = `https://www.googleapis.com${path}?key=${GOOGLE_API_KEY}`;
  const res = await axios.post(url, data);
  return res.data;
}

export async function callGoogleApiGet(path: string, params?: any) {
  const url = `https://www.googleapis.com${path}`;
  const res = await axios.get(url, { params: { key: GOOGLE_API_KEY, ...params } });
  return res.data;
}