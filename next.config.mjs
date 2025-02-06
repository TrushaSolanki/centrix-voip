import "dotenv/config"; // Import dotenv for environment variables
console.log("API Endpoint:", process.env.NEXT_PUBLIC_API_ENDPOINT);
/** @type {import('next').NextConfig} */
// const nextConfig = {};
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during builds
  },
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
};

export default nextConfig;
