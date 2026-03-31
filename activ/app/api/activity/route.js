// app/api/activity/route.js
let activitiesStore = []; // array مؤقت للتخزين في الذاكرة

export async function GET(req) {
  return new Response(JSON.stringify(activitiesStore), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const body = await req.json(); // parse incoming JSON
  if (!body.name || !body.coach) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newActivity = {
    _id: Date.now().toString(),
    name: body.name,
    coach: body.coach,
    date: body.date,
    time: body.time,
    capacity: body.capacity,
    location: body.location,
  };

  activitiesStore.push(newActivity);

  return new Response(JSON.stringify(newActivity), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}