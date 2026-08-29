import fs from 'node:fs';
import path from 'node:path';

const API_KEY = 'sc_live_8dc49c44b1543cc516e23213c941b903e703b930d6c60ec2';
const MCP_URL = 'https://api.spritecook.ai/mcp';

export async function callMcpTool(name, args = {}) {
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name, arguments: args },
      id: Date.now()
    })
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`MCP Error: ${JSON.stringify(data.error)}`);
  }
  
  if (data.result?.structuredContent) {
    return data.result.structuredContent;
  }
  
  if (data.result?.content?.[0]?.text) {
    try {
      return JSON.parse(data.result.content[0].text);
    } catch {
      return data.result.content[0].text;
    }
  }
  
  return data.result;
}

export async function pollJob(pollInfo, maxAttempts = 60, intervalMs = 2500) {
  const tool = pollInfo.tool || 'check_job_status';
  const args = pollInfo.arguments || {};

  console.log(`Polling job with ${tool}:`, args);

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, intervalMs));
    const status = await callMcpTool(tool, args);
    console.log(`[Attempt ${i + 1}/${maxAttempts}] Status:`, status.status || status.state || status);
    
    if (status.status === 'completed' || status.status === 'succeeded' || status.state === 'ready') {
      return status;
    }
    if (status.status === 'failed' || status.status === 'error') {
      throw new Error(`Job failed: ${JSON.stringify(status)}`);
    }
  }
  throw new Error('Polling timeout');
}

export async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  console.log(`Saved: ${destPath}`);
}
