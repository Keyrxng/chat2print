import { Message, OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const data = await req.json();

  const resp = await fetch(
    "https://worker-steep-sun-4178.keyrxng7749.workers.dev/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: data.messages,
      }),
    }
  );

  return resp;
}

export async function GET(req: Request) {
  const data = await req.json();

  const resp = await fetch(
    "https://worker-steep-sun-4178.keyrxng7749.workers.dev/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: data.messages,
      }),
    }
  );

  const chat = await resp.json();

  const messages = chat[0].inputs.messages;
  const response = chat[0].response;

  messages.push({
    role: "assistant",
    content: response.response,
  });

  const msg = {
    role: "assistant",
    content: response.response,
  };

  return new Response(JSON.stringify({ ...msg }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
