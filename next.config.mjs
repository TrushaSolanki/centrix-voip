/** @type {import('next').NextConfig} */
// const nextConfig = {};
const ServerBaseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/proxy/:path*", // Apply to API routes
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Type", value: "application/json" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${ServerBaseUrl}:path*`,
      },
    ];
  },
};

export default nextConfig;
