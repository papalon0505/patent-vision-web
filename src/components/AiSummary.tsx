"use client";

import { useEffect, useState } from "react";
import { getAiSummary } from "@/lib/api";
import styles from "./AiSummary.module.css";

interface AiSummaryProps {
  patentId: string;
}

export default function AiSummary({ patentId }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAiSummary(patentId)
      .then((result) => {
        setSummary(result.summary);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load summary");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patentId]);

  if (loading) {
    return <p className={styles.loading}>Generating summary...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return <p className={styles.summary}>{summary}</p>;
}