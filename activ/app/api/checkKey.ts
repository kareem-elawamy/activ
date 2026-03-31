export function GET() {
  console.log("طول المفتاح:", process.env.ANTHROPIC_API_KEY?.length);
  return new Response("Check console for API key length");
}