import { useRef, useState } from "react";
import Link from "next/link";
import { className } from "postcss-selector-parser";
import Header from "./header";
import Footer from "./footer";

export default function Page() {
  return (
    <>
      <div className="flex flex-col justify-between h-screen items-center pt-nav bg-white overflow-hidden">
        <div className="px-4 sm:px-6 flex items-center flex-1 lg:px-8">
          <div className="text-lg max-w-prose mx-auto mb-6">
            <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
