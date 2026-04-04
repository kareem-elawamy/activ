// app/api/heroes/[id]/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ── File-based storage helpers ─────────────────────────────────────────────

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

// ── GET /api/heroes/[id] ───────────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const heroes = readHeroes();
    const hero = heroes.find((h) => h._id === id);

    if (!hero) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }
    return NextResponse.json(hero);
  } catch (error) {
    console.error('[heroes/[id] GET]', error);
    return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 });
  }
}

// ── PUT /api/heroes/[id] ───────────────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, sport, bio, image, championships } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const heroes = readHeroes();
    const index = heroes.findIndex((h) => h._id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }

    const updatedHero = {
      ...heroes[index],
      name: name.trim(),
      sport: sport?.trim() || '',
      bio: bio?.trim() || '',
      image: image?.trim() || heroes[index].image || '',
      championships: Array.isArray(championships)
        ? championships.filter((c) => c && c.trim() !== '')
        : heroes[index].championships || [],
      updatedAt: new Date().toISOString(),
    };

    heroes[index] = updatedHero;
    writeHeroes(heroes);

    return NextResponse.json({ hero: updatedHero });
  } catch (error) {
    console.error('[heroes/[id] PUT]', error);
    return NextResponse.json({ error: 'Failed to update hero' }, { status: 500 });
  }
}

// ── DELETE /api/heroes/[id] ────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const heroes = readHeroes();
    const index = heroes.findIndex((h) => h._id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Hero not found' }, { status: 404 });
    }

    const deleted = heroes.splice(index, 1)[0];
    writeHeroes(heroes);

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error('[heroes/[id] DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete hero' }, { status: 500 });
  }
}
