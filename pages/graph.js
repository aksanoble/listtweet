import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("../components/graph"), {
  ssr: false
});

export default () => <DynamicComponentWithNoSSR />;
