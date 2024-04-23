/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '1p4qjacbjztnhom8.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    },
};

module.exports = nextConfig;