import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const checkUserPaymentTier = async (userId) => {
  const { data, error } = await supabase
    .from("payment_status")
    .select("tier")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching payment status:", error);
    return null;
  }

  return data;
};

const login = async (email, password) => {
  const { user, session, error } = await supabase.auth.signIn({
    email,
    password,
  });
  // Handle login...
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  // Handle logout...
};

const updatePaymentTierUI = (tier) => {
  const tierElement = document.getElementById("user-plan");
  const upgradeButton = document.getElementById("upgrade-btn");

  tierElement.textContent = tier || "Free";
  upgradeButton.style.display = tier === "Free" ? "block" : "none";
};

const handleLogin = async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await login(email, password);
};

const handleLogout = async (event) => {
  event.preventDefault();

  await logout();
};

const handleUpgrade = async (event) => {
  event.preventDefault();

  const { error } = await supabase.auth.update({
    payment_status: "Premium",
  });

  if (error) {
    console.error("Error upgrading:", error);
    return;
  }

  updatePaymentTierUI("Premium");
};

const handleSignup = async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { user, session, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Error signing up:", error);
    return;
  }

  updatePaymentTierUI("Free");
};

const handlePaymentStatusChange = (event) => {
  const { data: paymentStatus } = event;

  if (paymentStatus) {
    updatePaymentTierUI(paymentStatus.tier);
  }
};

const init = async () => {
  const user = supabase.auth.user();

  if (user) {
    const paymentStatus = await checkUserPaymentTier(user.id);
    updatePaymentTierUI(paymentStatus?.tier);
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      const user = supabase.auth.user();
      checkUserPaymentTier(user.id);
    } else {
      updatePaymentTierUI(null);
    }
  });

  supabase
    .from("payment_status")
    .on("UPDATE", handlePaymentStatusChange)
    .subscribe();
};

init();
