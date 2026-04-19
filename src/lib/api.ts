import { getAuth } from "firebase/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function authHeader(): Promise<Record<string, string>> {
  try {
    const user = getAuth().currentUser;
    if (user) {
      const token = await user.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    // Firebase not initialized yet
  }
  return {};
}

export interface Patent {
  patent_id: string;
  title: string;
  assignee: string | null;
  abstract: string | null;
  filing_date: string | null;
  status: string;
  jurisdiction: string;
  cpc_classes: string[];
}

export interface SearchResult {
  patents: Patent[];
  total: number;
  page: number;
}

export interface AiSummary {
  summary: string;
  cached: boolean;
}

export async function searchPatents(
  query: string,
  options?: { source?: string }
): Promise<SearchResult> {
  const res = await fetch(`${API_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify({
      query,
      sources: [options?.source || "USPTO"],
    }),
  });

  if (!res.ok) {
    throw new Error(`Search failed: ${res.statusText}`);
  }

  return res.json();
}

export async function getPatent(patentId: string): Promise<Patent> {
  // Called from Next.js Server Component — no Firebase token available server-side
  const res = await fetch(`${API_URL}/api/patent/${patentId}`);

  if (!res.ok) {
    throw new Error(`Patent not found: ${patentId}`);
  }

  return res.json();
}

export async function getAiSummary(
  patentId: string,
  locale: string = "en"
): Promise<AiSummary> {
  const res = await fetch(`${API_URL}/api/ai/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify({ patent_id: patentId, locale }),
  });

  if (!res.ok) {
    throw new Error(`Summary failed: ${res.statusText}`);
  }

  return res.json();
}