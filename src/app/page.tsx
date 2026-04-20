"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import PatentCard from "@/components/PatentCard";
import { searchPatents } from "@/lib/api";
import type { Patent } from "@/lib/api";
import styles from "./page.module.css";

export default function Home() {
  const [results, setResults] = useState<Patent[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const data = await searchPatents(query);
      setResults(data.patents);
    } catch {
      setError("搜尋失敗，請稍後再試");
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>PatentVision</h1>
        <p>AI 驅動專利視覺化分析平台</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {searching && <p className={styles.loading}>搜尋中...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.results}>
        {results.map((patent) => (
          <PatentCard key={patent.patent_id} patent={patent} />
        ))}
      </section>
    </main>
  );
}