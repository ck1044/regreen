/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'img.freepik.com', 'images.remotePatterns', 'regreen-bucket.s3.ap-northeast-2.amazonaws.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // public 폴더의 dev 디렉토리를 빌드에서 제외
  webpack: (config) => {
    config.module.rules.push({
      test: /public\/dev\//,
      loader: 'ignore-loader',
    });
    return config;
  },
}

module.exports = nextConfig 