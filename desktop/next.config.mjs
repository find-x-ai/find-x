/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
      missingSuspenseWithCSRBailout: false,
      warnCriticalDependencies: false,
    },
};

export default nextConfig;
