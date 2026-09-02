"use client";

import { DoctronicEmbed, type EmbedLandingPageConfig } from "@doctronic/embed";

import { useCallback, useEffect, useRef } from "react";
import styles from "./page.module.css";

const ARTICLE_START_CHAT_MESSAGE = "I have questions about type 2 diabetes";

const TEST_LANDING_PAGE: EmbedLandingPageConfig = {
  headline: "Ask about your health",
  bodyText: [
    "Get instant medical guidance from our AI health assistant and get a  consultation with a top doctor.",
    "What can I help you with today?",
  ],
  ctaButtonText: "Ask now",
  placeholders: ["Ask a question...", "Describe your symptoms..."],
  startersIntro: "I'm interested in...",
  starters: [
    {
      name: "Check my symptoms",
      message: "I have a headache and feel nauseous. What could this be?",
    },
    {
      name: "Ask about diabetes",
      message: "I have questions about type 2 diabetes",
    },
    {
      name: "Medication advice",
      message: "What should I know before starting metformin?",
    },
  ],
};

const SAMPLE_BLOG_PARAGRAPHS = [
  "Type 2 diabetes is one of the most common chronic conditions worldwide, affecting how your body processes blood sugar (glucose). When you have type 2 diabetes, your body either resists the effects of insulin or doesn't produce enough to maintain normal glucose levels. Left unmanaged, high blood sugar can lead to serious complications over time.",
  "The early signs of type 2 diabetes are often subtle. Increased thirst, frequent urination, unexplained weight loss, and fatigue are among the most common symptoms. Many people live with the condition for years before receiving a diagnosis, which is why regular blood sugar screening is so important - especially if you have risk factors like a family history or a sedentary lifestyle.",
  "Diet plays a central role in managing type 2 diabetes. Focusing on whole grains, lean proteins, vegetables, and healthy fats can help keep blood sugar levels stable throughout the day. It's not about cutting out all carbohydrates - it's about choosing the right ones and understanding how different foods affect your glucose response.",
  "Exercise is another powerful tool. Regular physical activity helps your cells use insulin more effectively, which lowers blood sugar naturally. Even a 30-minute walk after meals can make a measurable difference. Over time, consistent exercise may reduce the need for medication in some individuals.",
  "Monitoring your blood sugar at home gives you real-time feedback on how your body responds to food, activity, and stress. Continuous glucose monitors (CGMs) have made this easier than ever, providing trends and alerts without the need for constant finger pricks. This data helps you and your care team make better decisions.",
  "Living well with type 2 diabetes is absolutely possible. With the right combination of lifestyle changes, regular check-ups, and medication when needed, many people keep their blood sugar in a healthy range and avoid complications. The key is to stay informed, stay active, and work closely with your healthcare provider.",
];

function AskAboutArticleButton({ onClick }: { onClick: () => void }) {
  return (
    <div className={styles.popupTrigger}>
      <p className="font-semibold">Have questions about type 2 diabetes?</p>
      <p className={styles.popupTriggerText}>
        Our health assistant can help you understand your condition better.
      </p>
      <div className={styles.popupTriggerActions}>
        <button className={styles.modeButton} onClick={onClick} type="button">
          Ask about this article
        </button>
      </div>
    </div>
  );
}

function EmbedContainer({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<DoctronicEmbed | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const embed = new DoctronicEmbed({
      environment: "staging",
      onEvent: (event) =>
        console.log("[DoctronicEmbed]", event.type, event.data),
      onError: (error) =>
        console.error("[DoctronicEmbed]", error.reason, error.message),
      landingPage: TEST_LANDING_PAGE,
    });

    embed.show(el);
    embedRef.current = embed;

    return () => {
      embed.destroy();
      embedRef.current = null;
    };
  }, []);

  const handleAsk = useCallback(() => {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    embedRef.current?.startChat(ARTICLE_START_CHAT_MESSAGE);
  }, []);

  return (
    <>
      <AskAboutArticleButton onClick={handleAsk} />
      <div className={styles.contentViolator}>
        <div ref={containerRef} className={className} />
      </div>
    </>
  );
}

export default function EmbedTestPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <p className="font-semibold">Embed Test</p>
          <span className={styles.badge}>Dev</span>
        </div>
      </header>

      <article className={styles.article}>
        <p className="text-4xl font-semibold">
          Understanding Type 2 Diabetes: What You Need to Know
        </p>
        <p className="text-xs">Published Feb 27, 2026 &middot; 5 min read</p>

        <div className={styles.articleBody}>
          {SAMPLE_BLOG_PARAGRAPHS.slice(0, 2).map((text, index) => (
            <p key={index}>{text}</p>
          ))}

          <EmbedContainer className={styles.contentViolatorEmbed} />

          {SAMPLE_BLOG_PARAGRAPHS.slice(2).map((text, index) => (
            <p key={index + 2}>{text}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
