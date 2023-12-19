import { createClient } from "@supabase/supabase-js";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    const image64 = request.image64;

    createImage(image64)
      .then((response) => {
        sendResponse({ data: response });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });

    return true;
  }
});

async function createImage(image64, sendResponse) {
  const user = await chrome.storage.local.get(["session"]);
  const imageCount = await supabase.storage
    .from("user_uploads")
    .list(`${user.session.user.id}/`);

  const image = await fetch(image64);
  const contentType = image.headers.get("content-type");

  if (
    contentType !== "image/png" &&
    contentType !== "image/jpeg" &&
    contentType !== "image/webp"
  ) {
    sendResponse({ error: "Invalid image type, refresh and try again." });
    return;
  }

  const blobbish = await image.blob();

  const { data, error } = await supabase.storage
    .from("user_uploads")
    .upload(
      `${user.session.user.id}/${imageCount.data.length}.webp`,
      blobbish,
      {
        cacheControl: "3600",
        upsert: false,
      }
    );

  if (error) {
    throw new Error({ error: error.message });
  }

  const { error: actionError } = await supabase.from("user_actions").insert({
    user_id: user.session.user.id,
    action_type: "import",
  });

  if (actionError) {
    console.log("error: ", actionError);
  }

  console.log("action count updated");

  return data;
}
