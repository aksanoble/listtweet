import Header from "../components/header";
import Footer from "../components/footer";

export default function Page() {
  return (
    <>
      <Header />
      <div className="flex flex-col justify-between items-center py-32 bg-white overflow-hidden">
        <div className="px-4 sm:px-6 flex items-center flex-1 lg:px-8">
          <div className="text-lg max-w-prose mx-auto mb-6">
            <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Privacy Policy
            </h1>
            <p className="text-xl text-center text-gray-500 leading-8">
              Twitter access tokens will only be used to compute Lists and
              deleted immediately once the task is completed.
            </p>
          </div>
        </div>
        <div className="mt-8 w-full absolute bg-white pb-28 sm:pb-0 bottom-0">
          <Footer />
        </div>
      </div>
    </>
  );
}
