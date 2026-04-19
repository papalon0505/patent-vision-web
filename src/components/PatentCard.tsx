import Link from "next/link";
import styles from "./PatentCard.module.css";

export interface Patent {
  patent_id: string;
  title: string;
  assignee: string | null;
  abstract: string | null;
  filing_date: string | null;
  status: string;
}

interface PatentCardProps {
  patent: Patent;
}

export default function PatentCard({ patent }: PatentCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.id}>{patent.patent_id}</span>
        <span className={styles.status}>{patent.status}</span>
      </header>
      
      <Link href={`/patent/${patent.patent_id}`} className={styles.title}>
        {patent.title}
      </Link>
      
      {patent.assignee && (
        <p className={styles.assignee}>{patent.assignee}</p>
      )}
      
      {patent.abstract && (
        <p className={styles.abstract}>{patent.abstract}</p>
      )}
      
      <footer className={styles.footer}>
        {patent.filing_date && (
          <span className={styles.date}>申請日: {patent.filing_date}</span>
        )}
      </footer>
    </article>
  );
}