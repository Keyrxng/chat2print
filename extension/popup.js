import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWVleG9ldnh4anF1d2xoZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE1MTI0NzAsImV4cCI6MjAxNzA4ODQ3MH0.47_j0Q-nfP1bvG8wUP5RAsrpQKZMuZkv_rPvmjVIXHM";
const SUPABASE_URL = "https://ywaeexoevxxjquwlhfjx.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function updateAuthUI(user) {
  const authContainer = document.getElementById("auth-container");
  const statisticsContainer = document.querySelector(".statistics-container");
  let button;

  if (user) {
    authContainer.innerHTML =
      '<p>Welcome back <span id="user-email">' +
      user.email.split("@")[0] +
      "</span></p>";
    button = document.createElement("button");
    button.id = "logout";
    button.textContent = "Logout";
    button.onclick = logout;
    authContainer.appendChild(button);
    statisticsContainer.style.display = "grid";
    loadStats(user.id);
  } else {
    setupLoginInterface(authContainer);
    statisticsContainer.style.display = "none";
  }
}

function loadStats(userId) {
  const designsPw = document.getElementById("designs-pw");
  const storagePm = document.getElementById("storage-pm");
  const upscalesPd = document.getElementById("upscales-pd");
  const mockupsPd = document.getElementById("mockups-pd");

  try {
    let { data, error } = supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    console.log("User stats:", data);

    if (data && data.length > 0) {
      designsPw = data[0].designs_pw + " p/w";
      storagePm = data[0].storage_pm + "GB p/m";
      upscalesPd = data[0].upscales_pd + " p/d";
      mockupsPd = data[0].mockups_pd + " p/d";
    } else {
      console.log("No stats found for user with ID:", userId);
    }
  } catch (error) {
    console.error("Failed to retrieve user stats:", error);
  }
}

function setupLoginInterface(authContainer) {
  authContainer.innerHTML = `<input type="email" id="email" placeholder="Email" required>
    <input type="password" id="password" placeholder="Password" required>`;
  const button = document.createElement("button");
  button.id = "login";
  button.textContent = "Login";
  button.onclick = login;
  authContainer.appendChild(button);
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["session"], (result) => {
    if (result.session) {
      updateAuthUI({ email: result.session.user.email });
    } else {
      setupLoginInterface(document.getElementById("auth-container"));
    }
  });
});

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  chrome.runtime.sendMessage(
    {
      message: "login",
      email: email,
      password: password,
    },
    (response) => {
      if (response.error) {
        console.log("popup error: ", response.error);
        alert(response.error.message);
      } else {
        console.log("popup data: ", response);
        updateAuthUI(response.user);
      }
    }
  );
}

function logout() {
  chrome.runtime.sendMessage(
    {
      message: "logout",
    },
    (response) => {
      if (response.error) {
        console.log("popup error: ", response.error);
        alert(response.error.message);
      } else {
        console.log("popup data: ", response);
        updateAuthUI(null);
      }
    }
  );

  chrome.storage.local.remove(["session"], () => {
    console.log("Session removed");
    updateAuthUI(null);
  });
}
