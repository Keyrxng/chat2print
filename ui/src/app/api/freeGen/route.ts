export async function POST(req: any, res: any) {
  const prompt = await req.json();
  console.log("prompt: ", prompt);
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

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("image/png")) {
      const image = await response.blob();

      // we send content-type: image/png
      return new Response(image, {
        status: 200,
        headers: {
          "content-type": "image/png",
        },
      });
    } else {
      const text = await response.text();

      return new Response(text, {
        status: 500,
        headers: {
          "content-type": "text/plain",
        },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
