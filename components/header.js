import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";

export default function Header() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
      <nav className="relative flex items-center justify-between sm:h-10 md:justify-center">
        <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/">
              <a>ListTweet</a>
            </Link>
          </div>
        </div>
        <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
          <span className="inline-flex rounded-md shadow">
            <a
              target="_blank"
              href={process.env.NEXT_PUBLIC_ADMIN_SPONSOR_LINK}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-50 active:text-indigo-700 transition duration-150 ease-in-out"
            >
              Buy me a Tea!
            </a>
          </span>
        </div>
      </nav>
    </div>
  );
}
