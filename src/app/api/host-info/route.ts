import { NextResponse } from 'next/server';
import os from 'os';

export async function GET(request: Request) {
  let networkIp = '127.0.0.1';
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const netList = interfaces[name];
      if (!netList) continue;
      for (const net of netList) {
        if (net.family === 'IPv4' && !net.internal) {
          networkIp = net.address;
          break;
        }
      }
      if (networkIp !== '127.0.0.1') break;
    }
  } catch (e) {
    console.error("Failed to detect network IP", e);
  }

  const url = new URL(request.url);
  const port = url.port || '3000';
  const networkOrigin = `http://${networkIp}:${port}`;

  return NextResponse.json({
    success: true,
    localIp: networkIp,
    port,
    networkOrigin
  });
}
