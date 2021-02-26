import { useRef, useState } from "react";
import Link from "next/link";
import { className } from "postcss-selector-parser";
import Header from "../components/header";
import Footer from "../components/footer";
import { full } from "acorn-walk";

export default function Page() {
  return (
    <>
      <Header />
      <div className="flex flex-col justify-between h-screen items-center pt-nav bg-white overflow-hidden">
        <div className="px-4 sm:px-6 flex items-center flex-1 lg:px-8">
          <div className="text-lg max-w-prose mx-auto mb-6">
            <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Privacy Policy
            </h1>
            <p className="text-xl text-center text-gray-500 leading-8">
              Data provided to this site isn't stored in a database. All
              computations are performed in memory and cleared as soon as the
              task is completed.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
