import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";

export default function error() {
  return (
    <>
      <Header />
      <div className="flex flex-col justify-between h-screen items-center pt-nav bg-white overflow-hidden">
        <div className="px-4 sm:px-6 flex items-center flex-1 lg:px-8">
          <div className="text-lg max-w-prose mx-auto mb-6">
            <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Oops!
            </h1>
            <p className="text-xl text-center text-gray-500 leading-8">
              There was an unexpected error. Please try again.{" "}
              <Link href="/">Take me home!</Link>
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
