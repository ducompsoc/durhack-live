/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@durhack/web-components"],
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ]
  },
}

export default nextConfig
