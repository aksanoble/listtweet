import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../components/aksanoble"),
  {
    ssr: false
  }
);

export default () => {
  const [session, loading] = useSession();
  const router = useRouter();
  return <DynamicComponentWithNoSSR />;
};
