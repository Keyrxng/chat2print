import { NextApiRequest, NextApiResponse } from "next";
import Supabase from "../../../../classes/supabase";

const supabase = new Supabase();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await supabase.supabase.auth.getSession();
    const searchParams = new URLSearchParams(req.url?.split("?")[1]);
    const param = searchParams.get("token");
    const rt = searchParams.get("rt");

    if (session) {
      res.status(200).json({
        message: "User is authenticated",
        user: session,
      });
    } else {
      res.status(401).json({ message: "User not authenticated", user: null });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function FETCH(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await supabase.supabase.auth.getSession();
    const searchParams = new URLSearchParams(req.url?.split("?")[1]);
    const param = searchParams.get("token");
    const rt = searchParams.get("rt");

    if (session) {
      res.status(200).json({
        message: "User is authenticated",
        user: session,
      });
    } else {
      res.status(401).json({ message: "User not authenticated", user: null });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await supabase.supabase.auth.getSession();
    const searchParams = new URLSearchParams(req.url?.split("?")[1]);
    const param = searchParams.get("token");
    const rt = searchParams.get("rt");

    if (session) {
      return new Response(
        JSON.stringify({
          message: "User is authenticated",
          user: session,
        }),
        {
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "User not authenticated", user: null }),
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
