import { NextApiRequest, NextApiResponse } from "next";
import Supabase from "../../../../classes/supabase";

const supabase = new Supabase();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await supabase.supabase.auth.getSession();
    console.log("session", session);
    if (session) {
      res.status(200).json({
        message: "User is authenticated",
        user: session.data.session?.user,
      });
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function FETCH(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await supabase.supabase.auth.getSession();
    console.log("session", session);
    if (session) {
      res.status(200).json({
        message: "User is authenticated",
        user: session.data.session?.user,
      });
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await supabase.supabase.auth.getSession();
    console.log("session", session);
    if (session) {
      return new Response(
        JSON.stringify({
          message: "User is authenticated",
          user: session.data.session?.user,
        }),
        {
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
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

// export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const session = await supabase.supabase.auth.getSession();
//     console.log("session", session);
//     if (session) {
//       res.status(200).json({
//         message: "User is authenticated",
//         user: session.data.session?.user,
//       });
//     } else {
//       res.status(401).json({ message: "User not authenticated" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// export async function PUT(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const session = await supabase.supabase.auth.getSession();
//     console.log("session", session);
//     if (session) {
//       res.status(200).json({
//         message: "User is authenticated",
//         user: session.data.session?.user,
//       });
//     } else {
//       res.status(401).json({ message: "User not authenticated" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// export async function OPTIONS(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const session = await supabase.supabase.auth.getSession();
//     console.log("session", session);
//     if (session) {
//       res.status(200).json({
//         message: "User is authenticated",
//         user: session.data.session?.user,
//       });
//     } else {
//       res.status(401).json({ message: "User not authenticated" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
