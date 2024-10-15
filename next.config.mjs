/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        "firebasestorage.googleapis.com",
        "another-domain.com",
        "storage.googleapis.com"
      ],
    },
  };
  
  export default nextConfig;
