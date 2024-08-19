import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-zinc-200/30 h-auto flex justify-center p-5">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row p-5">
        <div className="mb-5 lg:mb-0 lg:w-1/4">
          <h2 className="text-xl mb-2">Find-X</h2>
          <p className="text-sm text-zinc-600">
            The most comprehensive <br /> ai search for web.
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
          <p className="text-sm text-zinc-600">Email: findx.org@gmail.com</p>
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
