import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'src', 'data', 'settings.json');

const DEFAULT_SETTINGS = {
  agencyPhone: '919876543210'
};

let memorySettings = { ...DEFAULT_SETTINGS };

function readSettingsFromFile() {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object') {
        memorySettings = { ...DEFAULT_SETTINGS, ...parsed };
        return memorySettings;
      }
    }
  } catch (err) {
    console.error("Error reading settings.json:", err);
  }
  return memorySettings;
}

function writeSettingsToFile(settings: typeof DEFAULT_SETTINGS): boolean {
  try {
    memorySettings = settings;
    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Error writing settings.json:", err);
    return false;
  }
}

export async function GET() {
  const settings = readSettingsFromFile();
  return NextResponse.json({ success: true, settings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body && typeof body === 'object') {
      const current = readSettingsFromFile();
      const updated = {
        ...current,
        agencyPhone: body.agencyPhone ? String(body.agencyPhone).trim() : current.agencyPhone
      };
      writeSettingsToFile(updated);
      return NextResponse.json({ success: true, settings: updated });
    }
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (err) {
    console.error("API POST settings error:", err);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
