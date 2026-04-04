// app/api/heroes/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ── File-based storage (same pattern as lib/db.js) ─────────────────────────

function getDataDir() {
  const projectData = path.join(process.cwd(), 'data');
  try {
    fs.mkdirSync(projectData, { recursive: true });
    const testFile = path.join(projectData, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return projectData;
  } catch {
    const tmpData = path.join('/tmp', 'activ-data');
    fs.mkdirSync(tmpData, { recursive: true });
    return tmpData;
  }
}

function readHeroes() {
  const filePath = path.join(getDataDir(), 'heroes.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function writeHeroes(data) {
  const filePath = path.join(getDataDir(), 'heroes.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ── GET /api/heroes ─────────────────────────────────────────────────────────
export async function GET() {
  try {
    const heroes = readHeroes();
    return NextResponse.json(heroes);
  } catch (error) {
    console.error('[heroes GET]', error);
    return NextResponse.json({ error: 'Failed to fetch heroes' }, { status: 500 });
  }
}

// ── POST /api/heroes ────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, sport, bio, image, championships } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const heroes = readHeroes();

    const newHero = {
      _id: `hero_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      sport: sport?.trim() || '',
      bio: bio?.trim() || '',
      image: image?.trim() || '',
      championships: Array.isArray(championships)
        ? championships.filter((c) => c && c.trim() !== '')
        : [],
      createdAt: new Date().toISOString(),
    };

    heroes.unshift(newHero);
    writeHeroes(heroes);

    return NextResponse.json(newHero, { status: 201 });
  } catch (error) {
    console.error('[heroes POST]', error);
    return NextResponse.json({ error: 'Failed to create hero' }, { status: 500 });
  }
}
