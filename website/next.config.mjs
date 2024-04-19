/** @type {import('next').NextConfig} */
const config = {
    // ...
    
    experimental: {
      serverComponentsExternalPackages: [
        'puppeteer-core',
        '@sparticuz/chromium-min',
      ],
    },
  };
  
  export default config;