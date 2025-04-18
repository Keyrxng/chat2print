// // Follow this setup guide to integrate the Deno language server with your editor:
// // https://deno.land/manual/getting_started/setup_your_environment
// // This enables autocomplete, go to definition, etc.

// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
// };

// Deno.serve(async (req) => {
//   // read a text file from storage and print its contents
//   // This is needed if you're planning to invoke your function from a browser.
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     // Create a Supabase client with the Auth context of the logged in user.
//     const supabaseClient = createClient(
//       // Supabase API URL - env var exported by default.
//       Deno.env.get("SUPABASE_URL") ?? "",
//       // Supabase API ANON KEY - env var exported by default.
//       Deno.env.get("SUPABASE_ANON_KEY") ?? "",
//       // Create client with Auth context of the user that called the function.
//       // This way your row-level-security (RLS) policies are applied.
//       {
//         global: {
//           headers: { Authorization: req.headers.get("Authorization")! },
//         },
//       }
//     );

//     const { userId, actionType } = await req.json();
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);

//     const { data, error } = await supabaseClient
//       .from("user_actions")
//       .select("id, timestamp")
//       .eq("user_id", userId)
//       .eq("action_type", actionType)
//       .gte("timestamp", yesterday.toISOString());

//     if (error) {
//       throw new Error("Error fetching user actions");
//     }

//     const maxActionsPerDay = 10; // Set your desired limit
//     const actionCount = data.length;
//     const hasReachedLimit = actionCount >= maxActionsPerDay;

//     // Return the number of actions and whether the user has reached the limit
//     return new Response(
//       JSON.stringify({
//         actionCount,
//         hasReachedLimit,
//         maxActionsPerDay,
//       }),
//       {
//         headers: { "Content-Type": "application/json" },
//         status: 200,
//       }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({
//         error: error.message,
//       }),
//       {
//         headers: { "Content-Type": "application/json" },
//         status: 500,
//       }
//     );
//   }
// });
// /* To invoke locally:

//   1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
//   2. Make an HTTP request:

//   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/actions' \
//     --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//     --header 'Content-Type: application/json' \
//     --data '{"name":"Functions"}'

// */
