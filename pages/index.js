import Layout from "../components/layout";
import Sort from "../components/sort";
import { signIn } from "next-auth/client";

import { useSession } from "next-auth/client";

export default function Page() {
  const [session, loading] = useSession();
  if (!session) {
    return (
      <Layout>
        <p>
          Sort all the accounts you follow on Twitter into lists. In 2 clicks.
        </p>
        <h2>Before we start</h2>
        <ol>
          <li>
            Create lists on Twitter with <strong> at least 1 member</strong>.
            For example: Programming, Design, Crypto.
          </li>
          <li>Please complete step 1. I'll wait here.</li>
          <li>Click the Big Button.</li>
        </ol>
        <div>
          <button
            onClick={() =>
              signIn("twitter").catch(e =>
                alert("Something went wrong, please try again in sometime. ")
              )
            }
          >
            I've initialised my lists. Let's go!
          </button>
        </div>
        <h2>How it works</h2>
        <ul>
          <li>
            We look at existing members in your list, learn from their tweets,
            add remaining accounts into lists they'd feel at home.
          </li>
        </ul>
      </Layout>
    );
  }
  return (
    <Layout>
      <Sort />
    </Layout>
  );
}

// fetch("api/auth/providers").then(res => res.);
