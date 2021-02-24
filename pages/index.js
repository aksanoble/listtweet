import Layout from "../components/layout";
import Sort from "../components/sort";
import { signIn } from "next-auth/client";
import { useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { FullPage, Slide } from "react-full-page";
import Hero from "../components/hero";
import CreateList from "../components/create-list";
import ConfirmList from "../components/confirm";

import { useSession } from "next-auth/client";

export default function Page() {
  const [session, loading] = useSession();
  const [signInStatus, setSignInStatus] = useState("");
  if (loading) {
    console.log("loading", loading);
  }

  const onSignInClick = () => {
    setSignInStatus("loading");
    signIn("twitter");
  };
  if (!session) {
    return (
      <>
        <FullPage>
          <Slide>
            <Hero />
          </Slide>
          <Slide>
            <CreateList />
          </Slide>
          <Slide>
            <ConfirmList />
          </Slide>
        </FullPage>
      </>
    );
  }
  return (
    <Layout>
      <Sort />
    </Layout>
  );
}
