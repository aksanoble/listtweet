import { useState } from "react";
import { signOut } from "next-auth/client";
import { useSession } from "next-auth/client";
import styles from "./header.module.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Router from "next/router";

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
      Router.push("/error");
    }
  };

  return (
    <>
      <Header />
      <div className="pt-nav flex flex-col justify-between min-h-screen bg-white overflow-hidden">
        <div className="w-full flex item-center justify-center pt-4">
          <div className="bg-white rounded-full flex justify-center overflow-hidden shadow-sm w-auto rounded-lg">
            <div className="px-6 py-2">
              <div className="flex flex-row  items-center">
                {session.user.image && (
                  <span
                    style={{ backgroundImage: `url(${session.user.image})` }}
                    className={styles.avatar}
                  />
                )}
                <span className="flex flex-col justify-center ml-2">
                  {/* <small>Signed in as</small> */}
                  <strong>{session.user.name || session.user.email}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {status === "welcome" && (
            <>
              <div className="bg-white">
                <div className="max-w-screen-xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                  <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
                    Please note
                  </h2>
                  <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    If you already have highly organised lists, please note this
                    step will add additional members to them. However, no
                    existing account in a list will be removed. <br />
                    Do you wish to proceed?
                  </p>
                  <div className="mt-8 flex justify-center flex-col sm:flex-row items-center">
                    <div className="inline-flex rounded-md shadow">
                      <button
                        onClick={processData}
                        className="cursor-pointer inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                      >
                        Yes, let's do this.
                      </button>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3 inline-flex">
                      <button
                        onClick={() => {
                          signOut().catch(e => {
                            Router.push("/error");
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
            </>
          )}
          {status === "success" && (
            <>
              <div className="relative py-16 bg-white overflow-hidden">
                <div className="flex justify-center relative px-4 sm:px-6 lg:px-8">
                  <div className="text-lg max-w-prose mx-auto mb-6">
                    <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
                      🧑‍💻 We're on it...
                    </h1>
                    <p className="text-xl text-center text-gray-500 leading-8">
                      We have started organising your lists. <br /> We will send
                      you an email report once we have your lists sorted. <br />
                      Thank you for trying out ListTweet.
                    </p>

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
          {status === "loading" && (
            <p className="text-center mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Loading...
            </p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
