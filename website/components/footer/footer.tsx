export const Footer = () => {
  return (
    <div className="border-t border-zinc-800 text-white h-auto flex justify-center">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row p-5">
        <div className="mb-5 lg:mb-0 lg:w-1/4">
          <h2 className="text-xl mb-2">FindX Search</h2>
          <p className="text-sm text-zinc-400">The ultimate ai search for web apps.</p>
        </div>
        <div className="mb-5 lg:mb-0 lg:w-1/4">
          <h3 className="text-lg mb-2">Quick Links</h3>
          <ul className="text-sm space-y-2 text-zinc-400">
            <li>
              <a href="/#" className="hover:underline">
                Privacy Policy
              </a>
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
          <p className="text-sm text-zinc-400">Email: sahilmulani501@gmail.com</p>
        </div>
        <div className="lg:w-1/4">
          <h3 className="text-lg mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a target="_blanc" href="https://twitter.com/find_x_ai" className="hover:underline text-zinc-400">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
