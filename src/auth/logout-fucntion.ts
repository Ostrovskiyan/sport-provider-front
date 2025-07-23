

import { signOut } from "next-auth/react"

export default async function logout() {
//   const cookiesStore = await cookies();
//     cookiesStore.delete("JSESSIONID");
  await signOut();
}