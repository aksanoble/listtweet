import { useState, useEffect } from "react";
import { signOut } from "next-auth/client";
import { useSession } from "next-auth/client";
import styles from "./header.module.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Router from "next/router";
import Loading from "./loading";

const fetchData = async () => {
  const res = await fetch("/api/classify");
  const data = await res.json();
  return data;
};

export default function Sort() {
  const [status, setStatus] = useState("welcome");
  const [session, loading] = useSession();
  useEffect(async () => {
    setStatus("loading");
    try {
      const data = await fetchData();
      setStatus("success");
    } catch (error) {
      Router.push("/error");
    }
  }, []);
  if (status === "loading") {
    return <Loading />;
  }
  return (
    <>
      <Header />
      <div className="pt-nav flex flex-col justify-between min-h-screen bg-white overflow-hidden">
        <div className="w-full flex item-center justify-center pt-4 mt-24">
          <div className="bg-white rounded-full flex justify-center overflow-hidden shadow-sm w-auto rounded-lg">
            <div className="py-2">
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
          {status === "success" && (
            <>
              <div className="relative py-16 bg-white overflow-hidden">
                <div className="flex justify-center relative px-4 sm:px-6 lg:px-8">
                  <div className="text-lg max-w-prose mx-auto mb-6">
                    <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
                      All good things take time
                    </h1>
                    <p className="text-xl text-center text-gray-500 leading-8">
                      We have started fetching your twitter network. We will
                      send you an email once we have your visualization and
                      lists ready. Thank you for trying ListTweet!
                    </p>

                    <div className="flex justify-center p-12">
                      <button
                        className="cursor-pointer inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                        onClick={signOut}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
