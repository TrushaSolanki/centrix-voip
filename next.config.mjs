console.log("API Endpoint:", process.env.NEXT_PUBLIC_API_ENDPOINT);

/** @type {import('next').NextConfig} */
// const nextConfig = {};
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
        destination: `https://api.centrixcc.com/:path*`,
      },
    ];
  },
};

export default nextConfig;
