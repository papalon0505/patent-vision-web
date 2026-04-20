"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import PatentCard from "@/components/PatentCard";
import { searchPatents } from "@/lib/api";
import type { PatentSummary } from "@/lib/api";
import styles from "./page.module.css";

export default function Home() {
  const [results, setResults] = useState<PatentSummary[]>([]);
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
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>PatentVision</h1>
        <p>AI-powered patent visualization and analysis</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {searching && <p className={styles.loading}>Searching...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <section className={styles.results}>
        {results.map((patent) => (
          <PatentCard key={patent.patent_id} patent={patent} />
        ))}
      </section>
    </main>
  );
}
