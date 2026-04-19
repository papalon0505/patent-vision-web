import AiSummary from "@/components/AiSummary";
import PatentMindMap from "@/components/PatentMindMap";
import { getPatent, getAiSummary } from "@/lib/api";
import styles from "./page.module.css";

interface PatentPageProps {
  params: { patentId: string };
}

export default async function PatentPage({ params }: PatentPageProps) {
  const patent = await getPatent(params.patentId).catch(() => null);
  
  if (!patent) {
    return (
      <main className={styles.main}>
        <p>Patent not found</p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <article className={styles.patent}>
        <header className={styles.header}>
          <h1>{patent.title}</h1>
          <div className={styles.meta}>
            <span>{patent.patent_id}</span>
            <span>{patent.assignee}</span>
          </div>
        </header>
        
        <section className={styles.section}>
          <h2>摘要</h2>
          <p>{patent.abstract}</p>
        </section>
        
        <section className={styles.section}>
          <h2>AI 摘要</h2>
          <AiSummary patentId={patent.patent_id} />
        </section>
        
        <section className={styles.section}>
          <h2>技術心智圖</h2>
          <PatentMindMap patentId={patent.patent_id} />
        </section>
      </article>
    </main>
  );
}