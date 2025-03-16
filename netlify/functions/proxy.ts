import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const TARGET_URL = 'https://generativelanguage.googleapis.com';

export const handler: Handler = async (event) => {
  const path = event.path.replace('/.netlify/functions/proxy', '');
  const url = `${TARGET_URL}${path}`;
  
  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        ...event.headers,
        host: new URL(TARGET_URL).host,
      },
      body: event.body
    });

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json'
      },
      body: responseBody
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error', details: error.message })
    };
  }
};