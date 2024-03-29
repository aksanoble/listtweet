import { useRef, useState } from "react";
import Sort from "../components/sort";
import Loading from "../components/loading";
import { signIn } from "next-auth/client";
import { FullPage, Slide } from "react-full-page";
import Hero from "../components/hero";
import ConfirmList from "../components/confirm";

import { useSession } from "next-auth/client";

export default function Page() {
  const [session, loading] = useSession();
  const fullPageRef = useRef();
  const [signInStatus, setSignInStatus] = useState("");
  const onSignInClick = () => {
    setSignInStatus("loading");
    signIn("twitter");
  };
  if (loading || signInStatus === "loading") {
    return <Loading />;
  }
  if (!session) {
    return (
      <>
        <FullPage ref={fullPageRef}>
          <Slide>
            <Hero onSignInClick={onSignInClick} fullPage={fullPageRef} />
          </Slide>
          <Slide>
            <ConfirmList onSignInClick={onSignInClick} />
          </Slide>
        </FullPage>
      </>
    );
  }
  return <Sort />;
}
