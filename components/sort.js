import { useState } from "react";
import { signOut } from "next-auth/client";

const fetchData = async () => {
  const res = await fetch("/api/classify");
  const data = await res.json();
  return data;
};

export default function Sort() {
  const [status, setStatus] = useState("welcome");
  const processData = async () => {
    setStatus("loading");
    try {
      const data = await fetchData();
      setStatus("success");
      setTimeout(() => {
        signOut().catch(e => {
          alert("Something went wrong. Please try again in sometime.");
        });
      }, 30000);
    } catch (error) {
      alert("Something went wrong. Please try again in sometime");
    }
  };

  return (
    <>
      {status === "welcome" && (
        <>
          Warning: If you already have organised lists, please note this may add
          additional members to it. However, no existing account in a list will
          be removed.
          <p>Do you wish to proceed?</p>
          <button onClick={processData}>Yes, let's do this!</button>
          <button
            onClick={() => {
              signOut().catch(e => {
                alert("Something went wrong. Please try again in sometime.");
              });
            }}
          >
            No, get me out of here.
          </button>
        </>
      )}
      {status === "success" && (
        <>
          <p>🙌 We have started organising your lists. </p>
          <p>
            🤓 We will send you an email report once we have your lists sorted!
          </p>
          <p>👋 Signing you out in 30 seconds...</p>
          <p>🎉 Thank you for trying out ListTweet.</p>
        </>
      )}
      {status === "loading" && <>Loading...</>}
    </>
  );
}
