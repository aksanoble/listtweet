import Header from "../components/header";
import Footer from "../components/footer";

export default function Hero(props) {
  return (
    <>
      <div className="relative h-screen flex flex-col justify-between bg-gray-50 pb-40">
        <div className="flex flex-col items-center justify-center flex-auto">
          <div className="hidden sm:block sm:absolute sm:inset-y-0 sm:h-full sm:w-full">
            <div className="relative h-full max-w-screen-xl mx-auto">
              <svg
                className="absolute right-full transform translate-y-1/4 translate-x-1/4 lg:translate-x-1/2"
                width="404"
                height="784"
                fill="none"
                viewBox="0 0 404 784"
              >
                <defs>
                  <pattern
                    id="svg-pattern-squares-1"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="784"
                  fill="url(#svg-pattern-squares-1)"
                />
              </svg>
              <svg
                className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:-translate-x-1/2"
                width="404"
                height="784"
                fill="none"
                viewBox="0 0 404 784"
              >
                <defs>
                  <pattern
                    id="svg-pattern-squares-2"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="784"
                  fill="url(#svg-pattern-squares-2)"
                />
              </svg>
            </div>
          </div>

          <div
            x-data="{ open: false }"
            className="relative flex justify-center items-center"
          >
            <Header />
            <div
              x-show="open"
              style={{ display: "none" }}
              className="absolute top-0 inset-x-0 p-2 md:hidden"
            >
              <div
                className="rounded-lg shadow-md transition transform origin-top-right"
                x-show="open"
              >
                <div className="rounded-lg bg-white shadow-xs overflow-hidden">
                  <div className="px-5 pt-4 flex items-center justify-between">
                    <div className="-mr-2">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                      >
                        <svg
                          className="h-6 w-6"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 mx-auto z-0 max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="text-center">
                <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
                  Step 2 : Seed each List with an account
                </h2>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  That's a minimum. Okay to have more. <br />
                  The account must be most representative of the List.
                </p>

                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <button
                      onClick={props.onSignInClick}
                      className="cursor-pointer w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                    >
                      My Lists are Seeded
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 w-full absolute bg-white pb-20 sm:pb-0 bottom-0">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
