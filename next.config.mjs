/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    // Optimize build performance
    poweredByHeader: false,
    // Force static generation for better performance
    trailingSlash: false,
    // Optimize images
    images: {
        unoptimized: true
    },
    // Handle API routes properly during build
    generateBuildId: async () => {
        return 'challan-build'
    }
};

export default nextConfig;
