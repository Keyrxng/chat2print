import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
export const runtime = "edge";

async function runUpscale(request: Request, imageUrl: string) {
  const output = await replicate.run(
    "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
    {
      input: {
        image: imageUrl,
      },
      webhook: `https://a328-86-27-41-90.ngrok-free.app/api/upscale/callback`,
      webhook_events_filter: ["completed"],
    }
  );
  return output;
}

// A gigantic mechanoid warrior infront of a interstellar background with planets, stars and rings around moons. Beautiful striking detail, HD, photo-realism

export async function POST(request: Request) {
  const { url } = await request.json();

  try {
    const output = await runUpscale(request, url);
    return new Response(JSON.stringify(output), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
