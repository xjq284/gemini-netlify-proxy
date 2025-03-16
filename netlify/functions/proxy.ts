import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const TARGET_URL = 'https://generativelanguage.googleapis.com';

const STATIC_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Gemini API 代理在 Netlify Functions 上</title>
</head>
<body>
  <h1>Gemini API 代理在 Netlify Functions 上</h1>
  <p>提示：此项目使用反向代理来解决 Google API 的位置限制等问题。</p>
  <p>如果您有以下需求，您可能需要此项目的支持：</p>
  <ol>
    <li>当您调用 Gemini API API 时看到错误信息"用户位置不支持 API 使用"。</li>
    <li>您想自定义 Gemini APIAPI</li>
  </ol>
  <p>有关技术讨论，请访问<a href="https://simonmy.com/posts/使用netlify反向代理google-palm-api.html">此链接</a>。</p>
</body>
</html>
`;

export const handler: Handler = async (event) => {
  // 返回静态说明页面
  if (event.path === '/.netlify/functions/proxy') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: STATIC_HTML
    };
  }

  // 处理 API 转发请求
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
      headers: { 'Content-Type': 'application/json' },
      body: responseBody
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error', details: error.message })
    };
  }
};
