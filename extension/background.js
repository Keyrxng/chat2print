import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ywaeexoevxxjquwlhfjx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWVleG9ldnh4anF1d2xoZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MTI0NzAsImV4cCI6MjAxNzA4ODQ3MH0.47_j0Q-nfP1bvG8wUP5RAsrpQKZMuZkv_rPvmjVIXHM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("message received", request);

  switch (request.message) {
    case "login": {
      const email = request.email;
      const password = request.password;

      async function updateToken() {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) console.log("Login error: ", error);
        console.log("Login data: ", data);

        let usr = await getUser(email);
        console.log("USER from get user: ", usr);

        if (!usr) {
          await createUser(email, password);
          await getUser(email);
        }

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
    }
    case "logout": {
      async function logout() {
        const { error } = await supabase.auth.signOut({ all: true });
        if (error) sendResponse({ user: null, error: error });
        else {
          await chrome.storage.local.remove(["accessT"]);
          await chrome.storage.local.remove(["refreshT"]);
          await chrome.storage.session.remove(["accessT"]);
          await chrome.storage.session.remove(["refreshT"]);
          sendResponse({ user: null });
        }
      }
      logout().then((res) => {
        console.log("Logged Out!: ", res);
        sendResponse(res);
      });
    }
    case "getToken": {
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
    }
    case "setToken": {
      async function setToken() {
        const at = request.at;
        const rt = request.rt;

        await chrome.storage.local.set({ accessT: at });
        await chrome.storage.local.set({ refreshT: rt });

        return { at, rt };
      }
      setToken().then((res) => {
        console.log("Token Set!: ", res);
        sendResponse(res);
      });
    }
    case "create": {
      async function saveDesign() {
        const imageUrl = request.image64;
        const resp = await fetch(imageUrl);
        const image = await resp.blob();

        const user = await getUserDetails();
        const userID = user.user.id;

        const { data: design, error } = await supabase.storage
          .from("design_images")
          .upload(`${userID}/placeholder.webp`, image, {
            cacheControl: "3600",
            upsert: false,
          })
          .then((res) => {
            console.log("RES: ", res);
          });

        if (error) {
          return console.log("Error creating design:", error);
        }

        return { design };
      }
      saveDesign().then((res) => {
        console.log("Design Saved!: ", res);
        sendResponse(res);
      });
    }
  }
});
async function createUser(email, password) {
  const userDetails = await getUserDetails();
  const user_id = userDetails.user.id;
  console.log("USER ID: ", userDetails.user);
  const { data, error } = await supabase
    .from("users")
    .insert([{ id: user_id, email: email, password: password }]);
  if (error) console.log("create user error: ", error);
  console.log("create user data: ", data);
}

async function getUser(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single({ limit: 1 });

  if (error) console.log("get user error: ", error);
  console.log("get user data: ", data);
  return data;
}

async function getUserDetails() {
  const jwt = await chrome.storage.local.get(["accessT"]);
  console.log("JWT: ", jwt.accessT);
  const { data: user, error: error } = await supabase.auth.getUser(jwt.accessT);
  console.log("get user details: ", user);
  if (error) {
    return console.log("Error getting user details:", error);
  }

  return user;
}

// async function createUserFolder() {
//   const user = await getUserDetails();
//   const userId = user.id;

//   const { data: folder, error } = await this.supabase.storage
//     .from("design_images")
//     .upload(`user-${userId}/designs/placeholder.webp`, "", {
//       cacheControl: "3600",
//       upsert: false,
//     });

//   if (error) {
//     return console.log("Error creating user folder:", error);
//   }

//   return { folder };
// }

// async function getUserFolder() {
//   const user = await getUserDetails();
//   const userId = user.id;

//   const { data: folder, error } = await this.supabase.storage
//     .from("design_images")
//     .list(`user-${userId}/designs/`, { limit: 1 });

//   if (error) {
//     return console.log("Error getting user folder:", error);
//   }

//   return { folder };
// }

// async function createDesign(image) {
//   const user = await getUserDetails();
//   const userId = user.id;

//   const { data: design, error } = await supabase
//     .from("saved_designs")
//     .insert([{ user_id: userId, name }]);

//   if (error) {
//     return console.log("Error creating design:", error);
//   }

//   return { design };
// }
