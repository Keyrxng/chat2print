import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ywaeexoevxxjquwlhfjx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWVleG9ldnh4anF1d2xoZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MTI0NzAsImV4cCI6MjAxNzA4ODQ3MH0.47_j0Q-nfP1bvG8wUP5RAsrpQKZMuZkv_rPvmjVIXHM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("DICKSSSS");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DICKSSS21312S");
  document.getElementById("sign-out").addEventListener("click", async () => {
    console.log("sign in clicked");
    const { error } = await supabase.auth.signOut({ all: true });
    if (error) console.error("Error signing out:", error);
    else updateAuthState(null);
  });

  document.getElementById("sign-in").addEventListener("click", async () => {
    console.log("sign in clicked");
    const { user, error } = await supabase.auth.signInWithPassword({
      email: "",
      password: "",
    });
    if (error) console.error("Error signing in:", error);
    else updateAuthState(user);
  });

  document
    .getElementById("refresh-token")
    .addEventListener("click", async () => {
      console.log("sign in clicked");
      const currentSession = supabase.auth.session();
      if (currentSession) {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) console.error("Error refreshing token:", error);
      }
    });
  updateAuthState({});
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
