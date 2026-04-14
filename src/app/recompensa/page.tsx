import type { Metadata } from "next";
import { RewardRoute } from "@/components/gamification/RewardRoute";
import { messages } from "@/lib/i18n/messages";

export const metadata: Metadata = {
  title: messages.pt.reward.metaTitle,
  description: messages.pt.reward.fireworksSub,
  robots: { index: false, follow: true },
};

export default function RecompensaPage() {
  return <RewardRoute locale="pt" />;
}
