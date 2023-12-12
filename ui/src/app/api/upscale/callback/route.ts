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
  output: string;
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
export async function POST(req: Request, res) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();

  const prediction = data as IncomingData;

  const userIdFromInput = prediction.input.image.split("/")[8];
  const imageUrl = prediction.output;
  const image = await fetch(imageUrl);
  console.log("image: ", image);

  const blob = await image.blob();

  console.log("blob: ", blob);

  // just uploaded to their bucket
  const { data: uploadData, error: uploadError } =
    await supabase.supabase.storage
      .from("user_uploads")
      .upload(`${userIdFromInput}/upscaled/${prediction.id}.png`, blob, {
        contentType: "image/png",
      });

  if (uploadError) {
    console.error("Error uploading blobbish to db: ", uploadError);
  } else {
    console.log(`Image ${prediction.id} saved to ${uploadData.path}.`);
  }

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

  // pinning to the upscales table
  const { error } = await supabase.supabase.from("upscales").upsert([
    {
      idd: prediction.id,
      finalized: finalizedJson,
      bucket_path: uploadData?.path,
      user_id: userIdFromInput,
    },
  ]);

  if (error) {
    console.error("Error uploading to table : ", error);
    return new Response("", { status: 500 });
  } else {
    console.log(
      `Upscale ${prediction.id} saved to database for user ${userIdFromInput}`
    );
    res.statusCode = 200;
    res.end(JSON.stringify(prediction));
  }
}
export async function GET(req: Request, res) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();

  const prediction = data as IncomingData;

  const userIdFromInput = prediction.input.image.split("/")[8];
  const imageUrl = prediction.output;
  const image = await fetch(imageUrl);
  console.log("image: ", image);

  const blob = await image.blob();

  console.log("blob: ", blob);

  // just uploaded to their bucket
  const { data: uploadData, error: uploadError } =
    await supabase.supabase.storage
      .from("user_uploads")
      .upload(`${userIdFromInput}/upscaled/${prediction.id}.png`, blob, {
        contentType: "image/png",
      });

  if (uploadError) {
    console.error("Error uploading blobbish to db: ", uploadError);
  } else {
    console.log(`Image ${prediction.id} saved to ${uploadData.path}.`);
  }

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

  // pinning to the upscales table
  const { error } = await supabase.supabase.from("upscales").upsert([
    {
      idd: prediction.id,
      finalized: finalizedJson,
      bucket_path: uploadData?.path,
      user_id: userIdFromInput,
    },
  ]);

  if (error) {
    console.error("Error uploading to table : ", error);
    return new Response("", { status: 500 });
  } else {
    console.log(
      `Upscale ${prediction.id} saved to database for user ${userIdFromInput}`
    );
    return new Response("", { status: 201 });
  }
}
export async function PUT(req: Request, res) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();

  const prediction = data as IncomingData;

  const userIdFromInput = prediction.input.image.split("/")[8];
  const imageUrl = prediction.output;
  const image = await fetch(imageUrl);
  console.log("image: ", image);

  const blob = await image.blob();

  console.log("blob: ", blob);

  // just uploaded to their bucket
  const { data: uploadData, error: uploadError } =
    await supabase.supabase.storage
      .from("user_uploads")
      .upload(`${userIdFromInput}/upscaled/${prediction.id}.png`, blob, {
        contentType: "image/png",
      });

  if (uploadError) {
    console.error("Error uploading blobbish to db: ", uploadError);
  } else {
    console.log(`Image ${prediction.id} saved to ${uploadData.path}.`);
  }

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

  // pinning to the upscales table
  const { error } = await supabase.supabase.from("upscales").upsert([
    {
      idd: prediction.id,
      finalized: finalizedJson,
      bucket_path: uploadData?.path,
      user_id: userIdFromInput,
    },
  ]);

  if (error) {
    console.error("Error uploading to table : ", error);
    return new Response("", { status: 500 });
  } else {
    console.log(
      `Upscale ${prediction.id} saved to database for user ${userIdFromInput}`
    );
    return new Response("", { status: 201 });
  }
}
