import Supabase from "@/classes/supabase";
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
export async function POST(req, res) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();
  const prediction = data;

  const promise = processWebhookData(prediction);

  if (prediction.status === "succeeded") {
    return sendResponse(res, 201, JSON.stringify(prediction));
  }

  if (prediction.status === "failed") {
    return sendResponse(res, 500, JSON.stringify(prediction));
  }

  return sendResponse(res, 202, "Accepted for processing");
}

function sendResponse(responseObj, statusCode, message) {
  return new Response(message, { status: statusCode });
}

async function processWebhookData(prediction) {
  console.log("processWebhookData", prediction);
  if (prediction.status === "succeeded") {
    try {
      const userIdFromInput = prediction.input.image.split("/")[8];
      const imageUrl = prediction.output;
      const image = await fetch(imageUrl);
      const blob = await image.blob();

      const dataSize = blob.size / 1024 / 1024;

      console.log("data size in MB: ", dataSize);

      const { error: usageError } = await supabase.supabase
        .from("user_actions")
        .insert({
          user_id: userIdFromInput,
          action_type: "enhancement",
          data_size: dataSize,
        });

      if (usageError) {
        console.error("Error uploading usage data: ", usageError);
      }

      const { data: uploadData, error: uploadError } =
        await supabase.supabase.storage
          .from("user_uploads")
          .upload(`${userIdFromInput}/upscaled/${prediction.id}.png`, blob, {
            cacheControl: (60 * 60 * 24 * 7).toString(),
            contentType: "image/png",
          });

      if (uploadError) {
        throw new Error("Error uploading blob to db: " + uploadError.message);
      }

      console.log(`Image ${prediction.id} saved to ${uploadData.path}.`);

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

      const { error } = await supabase.supabase.from("upscales").upsert([
        {
          idd: prediction.id,
          finalized: finalizedJson,
          bucket_path: uploadData?.path,
          user_id: userIdFromInput,
        },
      ]);

      if (error) {
        throw new Error("Error uploading to table: " + error.message);
      }

      console.log(
        `Upscale ${prediction.id} saved to database for user ${userIdFromInput}`
      );
      return new Response("", { status: 201 });
    } catch (error) {
      console.error(error);
    }
  } else {
    return new Response(JSON.stringify(prediction), { status: 202 });
  }
}

export async function GET(req: Request, res: any) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();

  const prediction = data as IncomingData;

  console.log("prediction: ", prediction);

  const userIdFromInput = prediction.input.image.split("/")[8];

  console.log("userIdFromInput: ", userIdFromInput);

  const imageUrl = prediction.output;

  console.log("imageUrl: ", imageUrl);

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
export async function PUT(req: Request, res: any) {
  console.log("🪝 incoming webhook!");

  const data = await req.json();

  if (data.status === "succeeded") {
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
  } else {
    return new Response("", { status: 202 });
  }
}
