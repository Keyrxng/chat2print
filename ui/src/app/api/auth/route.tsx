import Supabase from "../../../classes/supabase";
import { URLSearchParams } from "url";

const supabase = new Supabase();

async function handler(req: Request) {
  const searchParams = new URLSearchParams(req?.url?.split("?")[1]);
  const action = searchParams.get("action");

  try {
    switch (action) {
      case "signup":
        return await signUp(req);
      case "signin":
        return await signIn(req);
      case "signout":
        return await signOut(req);
      case "session":
        return await session(req);
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

async function session(req: Request) {
  const searchParams = new URLSearchParams(req?.url?.split("?")[1]);
  const at = searchParams.get("token");
  const rt = searchParams.get("rt");

  if (!at || !rt)
    return new Response(
      JSON.stringify({ error: "Missing token or refresh token" })
    );
  const { data, error } = await supabase.supabase.auth.setSession({
    access_token: at,
    refresh_token: rt,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  } else {
    return new Response(JSON.stringify({ data: data }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }
}

async function signUp(req: Request) {
  const searchParams = new URLSearchParams(req?.url?.split("?")[1]);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

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

async function signIn(req: Request) {
  const searchParams = new URLSearchParams(req?.url?.split("?")[1]);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

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
  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

async function signOut(req: Request) {
  const response = await supabase.signOut();

  return new Response(JSON.stringify(response), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}

export async function POST(req: Request) {
  return await handler(req);
}

export async function GET(req: Request) {
  return await handler(req);
}
