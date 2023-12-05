import { NextApiRequest, NextApiResponse } from "next";
import Supabase from "../../../../classes/supabase";

const supabase = new Supabase();

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  // const accessT = sessionStorage.getItem("accessT");
  //   const refreshT = sessionStorage.getItem("refreshT");
  // try {
  //   const { data, error: err } = await supabase.supabase.auth.setSession({
  //     access_token: accessT ?? "",
  //     refresh_token: refreshT ?? "",
  //   });
  //   if (err) {
  //     return Response.json({ error: err, accessT, refreshT, data });
  //   } else {
  //     return Response.json({ data: data });
  //   }
  // } catch (error) {
  //   return Response.json({ error: error, accessT, refreshT });
  // }
}
export async function FETCH(req: NextApiRequest, res: NextApiResponse) {
  // const accessT = sessionStorage.getItem("accessT");
  // const refreshT = sessionStorage.getItem("refreshT");
  // try {
  //   console.log("accessT", accessT);
  //   console.log("refreshT", refreshT);
  //   const { data, error: err } = await supabase.supabase.auth.setSession({
  //     access_token: accessT ?? "",
  //     refresh_token: refreshT ?? "",
  //   });
  //   if (err) {
  //     return Response.json({ error: err, accessT, refreshT, data });
  //   } else {
  //     return Response.json({ data: data });
  //   }
  // } catch (error) {
  //   return Response.json({ error: error, accessT, refreshT });
  // }
}
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // const accessT = sessionStorage.getItem("accessT");
  // const refreshT = sessionStorage.getItem("refreshT");
  // try {
  //   console.log("accessT", accessT);
  //   console.log("refreshT", refreshT);
  //   const { data, error: err } = await supabase.supabase.auth.setSession({
  //     access_token: accessT ?? "",
  //     refresh_token: refreshT ?? "",
  //   });
  //   if (err) {
  //     return Response.json({ error: err, accessT, refreshT, data });
  //   } else {
  //     return Response.json({ data: data });
  //   }
  // } catch (error) {
  //   return Response.json({ error: error, accessT, refreshT });
  // }
}
