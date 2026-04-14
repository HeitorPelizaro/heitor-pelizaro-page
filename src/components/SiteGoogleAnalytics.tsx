import { GoogleAnalytics } from "@next/third-parties/google";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function SiteGoogleAnalytics() {
  if (!gaId) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
