import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex justify-center border-t border-[#181818] p-5 text-[#f1f1f1]/80">
      <div className="w-full max-w-[1000px] flex flex-col lg:flex-row p-5">
        <div className="mb-5 lg:mb-0 lg:w-1/4">
          <h2 className="text-xl mb-2 ">Find-X</h2>
          <p className="text-sm text-[#656565]">
            The most comprehensive <br /> AI search for web.
          </p>
        </div>
        <div className="mb-5 lg:mb-0 lg:w-1/4">
          <h3 className="text-lg mb-2">Quick Links</h3>
          <ul className="text-sm space-y-2 text-zinc-600">
            <li>
              <Link href="/policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <a href="/#" className="hover:underline">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div className="mb-5 lg:mb-0 lg:w-1/4 space-y-2">
          <h3 className="text-lg mb-2">Contact Us</h3>
          <p className="text-sm text-zinc-600">Email: team@find-x.tech</p>
        </div>
        <div className="lg:w-1/4">
          <h3 className="text-lg mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              target="_blanc"
              href="https://twitter.com/find_x_ai"
              className="hover:underline text-zinc-600"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
