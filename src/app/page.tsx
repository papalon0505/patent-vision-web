import SearchBar from "@/components/SearchBar";
import PatentCard from "@/components/PatentCard";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>PatentVision</h1>
        <p>AI 驅動專利視覺化分析平台</p>
      </header>
      
      <SearchBar />
      
      <section className={styles.results}>
        <PatentCard
          patent={{
            patent_id: "US10234567",
            title: "GPU Cooling System with Liquid Metal Interface",
            assignee: "NVIDIA Corporation",
            abstract: "A cooling system for graphics processing units...",
            filing_date: "2024-01-15",
            status: "active",
          }}
        />
      </section>
    </main>
  );
}