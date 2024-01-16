export async function POST(req, res) {
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
    const image = await response.blob();

    console.log(image);

    // we send content-type: image/png
    return new Response(image, {
      status: 200,
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
