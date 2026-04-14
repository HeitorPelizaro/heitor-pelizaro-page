import type { Metadata } from "next";
import { RewardRoute } from "@/components/gamification/RewardRoute";
import { messages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  title: messages.en.reward.metaTitle,
  description: messages.en.reward.fireworksSub,
  robots: { index: false, follow: true },
};

export default function RewardPageEn() {
  return <RewardRoute locale="en" />;
}
