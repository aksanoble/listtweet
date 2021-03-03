import Header from "../components/header";
import Footer from "../components/footer";

export default function Page() {
  return (
    <>
      <Header />
      <div className="flex flex-col justify-between h-screen items-center pt-32 bg-white">
        <div className="px-4 sm:px-6 flex items-center flex-1 lg:px-8">
          <div className="text-lg max-w-prose mx-auto mb-6">
            <h1 className="mt-2 mb-8 text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Terms of Service
            </h1>
            <p className="text-xl text-center text-gray-500 leading-8">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
              NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
              HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN THE SOFTWARE.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
