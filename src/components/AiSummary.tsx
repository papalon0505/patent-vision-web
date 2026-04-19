"use client";

import { useEffect, useState } from "react";
import { getAiSummary } from "@/lib/api";
import styles from "./AiSummary.module.css";

interface AiSummaryProps {
  patentId: string;
  locale?: string;
}

export default function AiSummary({ patentId, locale = "en" }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAiSummary(patentId, locale)
      .then((result) => {
        setSummary(result.summary);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patentId, locale]);

  if (loading) {
    return <p className={styles.loading}>產生摘要中...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return <p className={styles.summary}>{summary}</p>;
}