const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [];
  },
  images: {
    domains: [],
  },

  sentry: {
    disableServerWebpackPlugin: !["production"].includes(
      process.env.NEXT_PUBLIC_APP_ENV || "local",
    ),
    disableClientWebpackPlugin: !["production"].includes(
      process.env.NEXT_PUBLIC_APP_ENV || "local",
    ),
  },

  webpack: (config, context) => {
    config.plugins = config.plugins || [];

    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });

    /* For transforming images to base64-embedded in the bundle */
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/i,
      use: {
        loader: "url-loader",
        options: {
          limit: 8192,
        },
      },
    });

    // xmtp-js, ref: https://github.com/xmtp/xmtp-js#installation
    if (context.isServer) {
      config.resolve = config.resolve || {};
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.fallback.fs = false;
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(withSentryConfig(nextConfig));
