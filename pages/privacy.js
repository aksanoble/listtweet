import { useRef, useState } from "react";
import Layout from "../components/layout";
import { className } from "postcss-selector-parser";
import { full } from "acorn-walk";

export default function Page() {
  return (
    <>
      <h2>Privacy Policy</h2>
      <p>
        Data provided to this site isn't stored in a database. All computations
        are performed in memory and cleared as soon as the task is completed.
      </p>
    </>
  );
}
