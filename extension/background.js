import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ywaeexoevxxjquwlhfjx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWVleG9ldnh4anF1d2xoZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MTI0NzAsImV4cCI6MjAxNzA4ODQ3MH0.47_j0Q-nfP1bvG8wUP5RAsrpQKZMuZkv_rPvmjVIXHM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("message received", request);

  if (request.message === "login") {
    const email = request.email;
    const password = request.password;

    async function updateToken() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) console.log("Login error: ", error);
      console.log("Login data: ", data);
      if (data.session) {
        await chrome.storage.session
          .set({ accessT: data.session.access_token })
          .then(() => console.log("access token set in storage"));
        await chrome.storage.session
          .set({ refreshT: data.session.refresh_token })
          .then(() => console.log("refresh token set in storage"));

        if (data) {
          sendResponse({ user: data.user, error: error });
        }
      }
    }
    updateToken().then((res) => {
      console.log("Logged In!: ", res);
      sendResponse(res);
    });
  } else if (request.message === "logout") {
    async function logout() {
      const { error } = await supabase.auth.signOut({ all: true });
      if (error) sendResponse({ user: null, error: error });
      else {
        await chrome.storage.local.remove(["accessT"]);
        await chrome.storage.local.remove(["refreshT"]);
        await chrome.storage.session.removeItem("accessT");
        await chrome.storage.session.removeItem("refreshT");
        sendResponse({ user: null });
      }
    }
    logout().then((res) => {
      console.log("Logged Out!: ", res);
      sendResponse(res);
    });
  } else if (request.message === "getToken") {
    async function getToken() {
      const reqAt = request.at;
      const reqRt = request.rt;
      console.log("request: ", request);

      const sat = await chrome.storage.session.get(["accessT"]);
      const srt = await chrome.storage.session.get(["refreshT"]);

      if (
        reqAt &&
        reqRt &&
        reqAt !== undefined &&
        reqRt !== undefined &&
        reqAt !== null &&
        reqRt !== null
      ) {
        // content script has grabbed site session tokens
        await chrome.storage.session.set({ accessT: reqAt });
        await chrome.storage.session.set({ refreshT: reqRt });
        return { at: reqAt, rt: reqRt };
      } else if (sat.accessT && srt.refreshT) {
        // popup is grabbing extension session tokens
        // lets set them into local
        await chrome.storage.local.set({ accessT: sat.accessT });
        await chrome.storage.local.set({ refreshT: srt.refreshT });

        return { at: sat.accessT, rt: srt.refreshT };
      } else {
        console.log("no tokens");
        return { at: null, rt: null };
      }
    }
    getToken().then((res) => {
      console.log("Token Got Got!: ", res);
      sendResponse(res);
    });
  } else if (request.message === "setToken") {
    const at = request.at;
    const rt = request.rt;

    async function setToken() {
      const { data, error } = await supabase.auth.setSession({
        access_token: at,
        refresh_token: rt,
      });
      chrome.storage.local.set({ accessT: at });
      chrome.storage.local.set({ refreshT: rt });

      console.log("data: ", data);
      if (error) sendResponse({ user: null, error: error });
      else sendResponse({ user: data });
    }
    setToken().then((res) => {
      console.log("Token Set!: ", res);
      sendResponse(res);
    });
  }
});

// chrome.storage.onChanged.addListener((changes, namespace) => {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(`Storage key "${key}" in namespace: `, namespace);
//     console.log(`Old value: ${oldValue}, new value: `, newValue);
//   }
// });
