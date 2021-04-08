import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../components/aksanoble"),
  {
    ssr: false
  }
);

export default () => {
  return <DynamicComponentWithNoSSR />;
};
