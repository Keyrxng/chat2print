import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function runUpscale(request: Request, imageUrl: string) {
  const output = await replicate.run(
    "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
    {
      input: {
        image: imageUrl,
        scale: 4,
      },
      webhook: `https://4a4c-86-27-41-90.ngrok.io/api/upscale/callback`,
      webhook_events_filter: ["completed"],
    }
  );
  return output;
}

export async function POST(request: Request) {
  const { url } = await request.json();
  console.log("🪝 incoming upscale request!", url);
  const output = await runUpscale(request, url);
  return new Response(JSON.stringify(output), {
    headers: {
      "content-type": "application/json",
    },
  });
}
