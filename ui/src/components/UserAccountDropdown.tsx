// import Supabase from "@/classes/supabase";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import React from "react";

function UserAccountDropdown({ user }) {
  return <></>;
}

export default UserAccountDropdown;

// export async function getServerSideProps() {
//   const session = await fetch("/api/auth/check");
//   console.log("session", session);
//   if (session) {
//     return {
//       props: {
//         user: session.json().then((data) => data.user),
//       },
//     };
//   } else {
//     return {
//       props: {
//         user: null,
//       },
//     };
//   }
// }
