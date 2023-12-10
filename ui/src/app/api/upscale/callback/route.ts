import Supabase from "@/classes/supabase";
import { promises as fs } from "fs";
const supabase = new Supabase();

interface IncomingData {
  id: string;
  version: string;
  created_at: string;
  started_at: string;
  completed_at: string;
  status: string;
  input: {
    image: string;
  };
  output: {
    image: string;
  };
  urls: {
    cancel: string;
    get: string;
  };
  error: string;
  logs: string;
  metrics: {
    predict_time: number;
  };
}
export async function POST(req: Request, res: Response) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();
  console.log(data);

  const prediction = data as IncomingData;
  console.log(prediction);

  const { data: userData } = await supabase.supabase.auth.getSession();
  const finalizedJson = {
    input: prediction.input,
    output: prediction.output,
    created_at: prediction.created_at,
    started_at: prediction.started_at,
    completed_at: prediction.completed_at,
    cancel: prediction.urls.cancel,
    get: prediction.urls.get,
    predict_time: prediction.metrics.predict_time,
  };

  const { error } = await supabase.supabase.from("user-upscales").upsert([
    {
      idd: prediction.id,
      user_id: userData.session?.user.id,
      finalized: finalizedJson,
    },
  ]);

  if (error) {
    console.error("Error uploading to db: ", error);
    return new Response("", { status: 500 });
  } else {
    console.log(
      `Upscale ${prediction.id} saved to database for user ${userData.session?.user.email}`
    );
    return new Response("", { status: 200 });
  }
}
export async function GET(req: Request, res: Response) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();
  console.log(data);

  const prediction = data as IncomingData;
  console.log(prediction);

  const { data: userData } = await supabase.supabase.auth.getSession();
  const finalizedJson = {
    input: prediction.input,
    output: prediction.output,
    created_at: prediction.created_at,
    started_at: prediction.started_at,
    completed_at: prediction.completed_at,
    cancel: prediction.urls.cancel,
    get: prediction.urls.get,
    predict_time: prediction.metrics.predict_time,
  };

  const { error } = await supabase.supabase.from("user-upscales").upsert([
    {
      idd: prediction.id,
      user_id: userData.session?.user.id,
      finalized: finalizedJson,
    },
  ]);

  if (error) {
    console.error("Error uploading to db: ", error);
    return new Response("Error uploading to db: ", { status: 500 });
  } else {
    console.log(
      `Upscale ${prediction.id} saved to database for user ${userData.session?.user.email}`
    );
    return new Response("", { status: 200 });
  }
}
export async function PUT(req: Request, res: Response) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();
  console.log(data);

  const prediction = data as IncomingData;
  console.log(prediction);

  const { data: userData } = await supabase.supabase.auth.getSession();
  const finalizedJson = {
    input: prediction.input,
    output: prediction.output,
    created_at: prediction.created_at,
    started_at: prediction.started_at,
    completed_at: prediction.completed_at,
    cancel: prediction.urls.cancel,
    get: prediction.urls.get,
    predict_time: prediction.metrics.predict_time,
  };

  const { error } = await supabase.supabase.from("user-upscales").upsert([
    {
      idd: prediction.id,
      user_id: userData.session?.user.id,
      finalized: finalizedJson,
    },
  ]);

  if (error) {
    console.error("Error uploading to db: ", error);
    return new Response("", { status: 500 });
  } else {
    console.log(
      `Upscale ${prediction.id} saved to database for user ${userData.session?.user.email}`
    );
    return new Response("", { status: 200 });
  }
}
