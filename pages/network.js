import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

const DynamicComponentWithNoSSR = dynamic(() => import("../components/graph"), {
  ssr: false
});

export default () => {
  const [session, loading] = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session && !loading) {
      router.push("/");
    }
  }, [session, loading]);
  return <DynamicComponentWithNoSSR />;
};
