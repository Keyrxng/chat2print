import { NextApiRequest, NextApiResponse } from "next";
import Supabase from "../../../classes/supabase";
import { URLSearchParams } from "url";

const supabase = new Supabase();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const searchParams = new URLSearchParams(req?.url?.split("?")[1]);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "signup":
        return await signUp(req, res);
      case "signin":
        return await signIn(req, res);
      case "signout":
        return await signOut(req, res);
      case "session":
        return await session(req, res);
      default:
        return new Response(
          JSON.stringify({ message: "Invalid action", action: action }),
          {
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
          }
        );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

async function session(req: NextApiRequest, res: NextApiResponse) {
  const searchParams = new URLSearchParams(req?.url?.split("?")[1]);
  const at = searchParams.get("token");
  const rt = searchParams.get("rt");

  const session = await supabase.sessionRestore(at, rt);

  return new Response(JSON.stringify(session), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

async function signUp(req: NextApiRequest, res: NextApiResponse) {
  const searchParams = new URLSearchParams(req?.url?.split("?")[1]);
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  console.log("email", email);
  console.log("password", password);
  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Missing email or password" }),
      {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  }
  const response = await supabase.signUp(email, password);

  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

async function signIn(req: NextApiRequest, res: NextApiResponse) {
  const searchParams = new URLSearchParams(req?.url?.split("?")[1]);
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  console.log("email", email);
  console.log("password", password);
  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Missing email or password" }),
      {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
  }
  const response = await supabase.signIn(email, password);
  console.log("response", response);
  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

async function signOut(req: NextApiRequest, res: NextApiResponse) {
  const response = await supabase.signOut();

  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export function GET(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res);
}
export function POST(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res);
}
export function PUT(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res);
}
export function DELETE(req: NextApiRequest, res: NextApiResponse) {
  return handler(req, res);
}
