export const runtime = "edge";

export async function POST(req: any, res: any) {
  const prompt = await req.json();
  const apiUrl = "https://worker-patient-hill-2054.keyrxng7749.workers.dev/";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(prompt),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // we receive content-type: image/png

    return new Response(response.body, {
      headers: {
        "content-type": "image/png",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
