/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Pad aanpassen naar waar je JS/CSS echt staat
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
