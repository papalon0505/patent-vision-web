import SearchBar from "@/components/SearchBar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>PatentVision</h1>
        <p>AI 驅動專利視覺化分析平台</p>
      </header>

      <SearchBar />

      <section className={styles.results} />
    </main>
  );
}