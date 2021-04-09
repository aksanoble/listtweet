import Link from "next/link";
import { useSession, signOut } from "next-auth/client";

export default function Header() {
  const [session, loading] = useSession();

  return (
    <div className="fixed w-full flex justify-between py-4 bg-white top-0 left-0 mx-auto shadow-sm px-4 sm:px-6">
      <nav className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/">
              <a>ListTweet</a>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <span className="inline-flex">
            {session ? (
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-50 active:text-indigo-700 transition duration-150 ease-in-out"
                onClick={signOut}
              >
                Logout
              </button>
            ) : (
              <Link href="/aksanoble/network">
                <a className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-50 active:text-indigo-700 transition duration-150 ease-in-out">
                  Example Viz
                </a>
              </Link>
            )}
          </span>
          <span className="inline-flex rounded-md shadow">
            <a
              target="_blank"
              rel="noreferrer"
              href={process.env.NEXT_PUBLIC_ADMIN_SPONSOR_LINK}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue active:bg-gray-50 active:text-indigo-700 transition duration-150 ease-in-out"
            >
              Buy me a tea!
            </a>
          </span>
        </div>
      </nav>
    </div>
  );
}
