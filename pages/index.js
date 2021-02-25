import { useRef } from "react";
import Sort from "../components/sort";

import { useState } from "react";
import { FullPage, Slide } from "react-full-page";
import Hero from "../components/hero";
import CreateList from "../components/create-list";
import ConfirmList from "../components/confirm";

import { useSession } from "next-auth/client";

export default function Page() {
  const [session, loading] = useSession();
  const fullPageRef = useRef();
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
        <FullPage ref={fullPageRef}>
          <Slide>
            <Hero fullPage={fullPageRef} />
          </Slide>
          <Slide>
            <CreateList fullPage={fullPageRef} />
          </Slide>
          <Slide>
            <ConfirmList />
          </Slide>
        </FullPage>
      </>
    );
  }
  return <Sort />;
}
