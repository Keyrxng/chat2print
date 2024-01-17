import Supabase from "@/classes/supabase";
const supabase = new Supabase();

export async function POST(req: Request, res: any) {
  const data = await req.json();
  const prediction = data;

  processWebhookData(prediction);

  if (prediction.status === "succeeded") {
    return sendResponse(res, 201, JSON.stringify(prediction));
  }

  if (prediction.status === "failed") {
    return sendResponse(res, 500, JSON.stringify(prediction));
  }

  return sendResponse(res, 202, "Accepted for processing");
}

function sendResponse(
  responseObj: any,
  statusCode: number,
  message: BodyInit | null | undefined
) {
  return new Response(message, { status: statusCode });
}

async function processWebhookData(prediction: {
  status: string;
  input: { image: string };
  output: any;
  id: any;
  created_at: any;
  started_at: any;
  completed_at: any;
  urls: { cancel: any; get: any };
  metrics: { predict_time: any };
}) {
  if (prediction.status === "succeeded") {
    try {
      const userIdFromInput = prediction.input.image.split("/")[8];
      const imageUrl = prediction.output;
      const image = await fetch(imageUrl);
      const blob = await image.blob();

      const dataSize = blob.size / 1024 / 1024;

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

      return new Response("", { status: 201 });
    } catch (error) {
      console.error(error);
    }
  } else {
    return new Response(JSON.stringify(prediction), { status: 202 });
  }
}
