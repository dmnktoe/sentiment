/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cms.project-sentiment.org",
                port: '',
                pathname: "/uploads/**/*",
            },
        ],
    }
};

export default nextConfig;
