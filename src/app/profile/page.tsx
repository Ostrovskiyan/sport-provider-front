import Link from "next/link";
import LogoutButton from "@/auth/logout-button";
import { userService } from "@/services/user-service";

export default async function Profile() {
  const profileData = await userService.getProfile();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Profile Page of {profileData.fullName}</h1>
        <p className="text-lg">Email {profileData.email}.</p>
        <p className="text-lg">Birthday {profileData.birthday}.</p>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/">
          Go back to Home
        </Link>
        <LogoutButton />
      </footer>
    </div>
  );
}