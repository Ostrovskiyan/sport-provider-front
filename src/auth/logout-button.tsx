'use client'
import logout  from "./logout-fucntion";

export default function LogoutButton() {
  return (
    <button onClick={() => logout()}>Sign out</button>
  );
}