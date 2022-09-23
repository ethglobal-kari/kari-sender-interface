import * as Sentry from "@sentry/nextjs";

Sentry.init({
  enabled: ["production"].includes(process.env.NEXT_PUBLIC_APP_ENV || "local"),
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV || "local",
  tracesSampleRate: ["production"].includes(process.env.NEXT_PUBLIC_APP_ENV || "local") ? 0.25 : 0,
});
