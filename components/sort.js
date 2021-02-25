import { useState } from "react";
import { signOut } from "next-auth/client";
import { useSession } from "next-auth/client";
import styles from "./header.module.css";
import Header from "../components/header";
import Footer from "../components/footer";

const fetchData = async () => {
  const res = await fetch("/api/classify");
  const data = await res.json();
  return data;
};

export default function Sort() {
  const [status, setStatus] = useState("welcome");
  const [session, loading] = useSession();

  const processData = async () => {
    setStatus("loading");
    try {
      const data = await fetchData();
      setStatus("success");
    } catch (error) {
      alert("Something went wrong. Please try again in sometime");
    }
  };

  return (
    <>
      <Header />
      <div className="bg-white flex justify-center overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex">
            {session.user.image && (
              <span
                style={{ backgroundImage: `url(${session.user.image})` }}
                className={styles.avatar}
              />
            )}
            <span>
              <small>Signed in as</small>
              <br />
              <strong>{session.user.name || session.user.email}</strong>
            </span>
          </div>
        </div>
      </div>

      <div>
        {status === "welcome" && (
          <>
            <div className="bg-white">
              <div className="max-w-screen-xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
                  WARNING
                </h2>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  If you already have highly organised lists, please note this
                  step will add additional members to them. However, no existing
                  account in a list will be removed. <br />
                  Do you wish to proceed?
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex rounded-md shadow">
                    <button
                      onClick={processData}
                      className="cursor-pointer inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                    >
                      Yes, let's do this.
                    </button>
                  </div>
                  <div className="ml-3 inline-flex">
                    <button
                      onClick={() => {
                        signOut().catch(e => {
                          alert(
                            "Something went wrong. Please try again in sometime."
                          );
                        });
                      }}
                      className="cursor-pointer inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:shadow-outline focus:border-indigo-300 transition duration-150 ease-in-out"
                    >
                      No, get me out of here.
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </>
        )}
        {status === "success" && (
          <>
            <div className="relative py-16 bg-white overflow-hidden">
              <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
                <div className="relative h-full text-lg max-w-prose mx-auto">
                  <svg
                    className="absolute top-12 left-full transform translate-x-32"
                    width="404"
                    height="384"
                    fill="none"
                    viewBox="0 0 404 384"
                  >
                    <defs>
                      <pattern
                        id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="4"
                          height="4"
                          className="text-gray-200"
                          fill="currentColor"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="404"
                      height="384"
                      fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
                    />
                  </svg>
                  <svg
                    className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
                    width="404"
                    height="384"
                    fill="none"
                    viewBox="0 0 404 384"
                  >
                    <defs>
                      <pattern
                        id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="4"
                          height="4"
                          className="text-gray-200"
                          fill="currentColor"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="404"
                      height="384"
                      fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
                    />
                  </svg>
                  <svg
                    className="absolute bottom-12 left-full transform translate-x-32"
                    width="404"
                    height="384"
                    fill="none"
                    viewBox="0 0 404 384"
                  >
                    <defs>
                      <pattern
                        id="d3eb07ae-5182-43e6-857d-35c643af9034"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="4"
                          height="4"
                          className="text-gray-200"
                          fill="currentColor"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="404"
                      height="384"
                      fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-center relative px-4 sm:px-6 lg:px-8">
                <div className="text-lg max-w-prose mx-auto mb-6">
                  <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
                    🧑‍💻 We're on it...
                  </h1>
                  <ul>
                    <li className="text-xl text-gray-500 leading-8">
                      We have started organising your lists.{" "}
                    </li>
                    <li className="text-xl text-gray-500 leading-8">
                      We will send you an email report once we have your lists
                      sorted!
                    </li>
                    <li className="text-xl text-gray-500 leading-8">
                      Thank you for trying out ListTweet.
                    </li>
                  </ul>
                  <div className="flex justify-center p-12">
                    <button
                      className="cursor-pointer inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                      onClick={signOut}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {status === "loading" && <>Loading...</>}
      </div>
      <Footer />
    </>
  );
}
