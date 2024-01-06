import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWVleG9ldnh4anF1d2xoZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MTI0NzAsImV4cCI6MjAxNzA4ODQ3MH0.47_j0Q-nfP1bvG8wUP5RAsrpQKZMuZkv_rPvmjVIXHM";
const SUPABASE_URL = "https://ywaeexoevxxjquwlhfjx.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "login") {
    const email = request.email;
    const password = request.password;

    supabase.auth
      .signInWithPassword({ email: email, password: password })
      .then((response) => {
        if (response.data.session) {
          chrome.storage.local.set(
            { session: response.data.session },
            () => {}
          );
        }
        sendResponse({ user: response.data.user, error: response.error });
      })
      .catch((error) => {
        sendResponse({ user: null, error: error.message });
      });

    return true;
  }

  if (request.message === "create") {
    const image64 = request?.image64;

    createImage(image64)
      .then((response) => {
        sendResponse({ data: response });
      })
      .catch((error) => {
        console.log("background.js: error", error);
        sendResponse({ data: error.message });
      });
    return true;
  }
});

async function createImage(image64, sendResponse) {
  const user = await chrome.storage.local.get(["session"]);
  const image = await fetch(image64);
  const contentType = image.headers.get("content-type");

  if (
    contentType !== "image/png" &&
    contentType !== "image/jpeg" &&
    contentType !== "image/webp"
  ) {
    return "Invalid image type, refresh and try again.";
  }
  const blobbish = await image.blob();

  const imageName = image64.split("/")[3].split("?")[0];

  const dataSize = blobbish.size / 1024 / 1024;

  const { data, error } = await supabase.storage
    .from("user_uploads")
    .upload(`${user.session.user.id}/${imageName}.webp`, blobbish, {
      cacheControl: "60860000",
      upsert: false,
    });

  if (error) {
    console.log("upload error", error);
    return error.message;
  }

  const { error: actionError } = await supabase.from("user_actions").insert({
    user_id: user.session.user.id,
    action_type: "import",
    data_size: dataSize.toFixed(8),
  });

  if (actionError) {
    console.log("action error", actionError);
    return actionError.message;
  }

  return data.path;
}
