import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ywaeexoevxxjquwlhfjx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWVleG9ldnh4anF1d2xoZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MTI0NzAsImV4cCI6MjAxNzA4ODQ3MH0.47_j0Q-nfP1bvG8wUP5RAsrpQKZMuZkv_rPvmjVIXHM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ message: "getToken" });

  document.getElementById("sign-out").addEventListener("click", async () => {
    console.log("sign out clicked");

    chrome.runtime.sendMessage({ message: "logout" }).then((data) => {
      console.log("LOGOUT DATA: ", data);
      updateAuthState(data);
    });
  });

  document.getElementById("sign-in").addEventListener("click", async () => {
    console.log("sign in clicked");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    chrome.runtime
      .sendMessage({
        message: "login",
        email: email,
        password: password,
      })
      .then((data) => {
        updateAuthState(data);
      });
  });

  document
    .getElementById("refresh-token")
    .addEventListener("click", async () => {
      console.log("refresh token clicked");
      chrome.runtime.sendMessage({ message: "getToken" }, async (response) => {
        // const token = response.token;
        // console.log("TOKEN: ", token);
      });
    });
});

function updateAuthState(user) {
  document.getElementById("sign-in").disabled = !!user;
  document.getElementById("sign-out").disabled = !user;
  document.getElementById("refresh-token").disabled = !user;
}
// On load, update auth state

// supabase.auth.onAuthStateChange((_event, session) => {
//   chrome.storage.local.set({ accessToken: session?.access_token || "" });
// });

// // Whenever the extension is opened, sync the token with the current session
// chrome.storage.local.get("accessToken", (data) => {
//   if (data.accessToken) {
//     supabase.auth.setAuth(data.accessToken);
//   }
// });
