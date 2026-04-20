"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getAuth } from "firebase/auth";
import styles from "./PatentMindMap.module.css";

interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

interface PatentMindMapProps {
  patentId: string;
}

export default function PatentMindMap({ patentId }: PatentMindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
    setLoading(true);
    if (!svgRef.current) return;

    const abortController = new AbortController();

    async function streamMindmap() {
      let token = "";
      try {
        const currentUser = getAuth().currentUser;
        if (currentUser) {
          token = await currentUser.getIdToken();
        }
      } catch {
        // Firebase not yet initialized; proceed without token
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${apiUrl}/api/ai/mindmap/${encodeURIComponent(patentId)}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: abortController.signal,
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      if (data.nodes && data.edges) {
        const rootNode: MindMapNode = {
          id: "root",
          label: patentId,
          children: (data.nodes as Array<{ id: string; label?: string; title?: string }>).map((n) => ({
            id: n.id,
            label: n.label ?? n.title ?? n.id,
          })),
        };
        renderMindMap(rootNode);
      }
      setLoading(false);
    }

    streamMindmap().catch((err: unknown) => {
      if (err instanceof Error && err.name !== "AbortError") {
        setError("Failed to load mind map");
      }
      setLoading(false);
    });

    return () => {
      abortController.abort();
    };
  }, [patentId]);

  const renderMindMap = (data: MindMapNode) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const tree = d3.tree<MindMapNode>().size([height - 100, width / 2 - 50]);
    const root = d3.hierarchy(data);
    const treeData = tree(root);

    // Links
    g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#e5e5e5")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .linkHorizontal<d3.HierarchyPointLink<MindMapNode>, d3.HierarchyPointNode<MindMapNode>>()
          .x((d) => d.y)
          .y((d) => d.x)
      );

    // Nodes
    const nodes = g
      .selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodes
      .append("circle")
      .attr("r", 6)
      .attr("fill", (d) => (d.depth === 0 ? "#2563eb" : "#e5e5e5"));

    nodes
      .append("text")
      .attr("dy", 4)
      .attr("x", (d) => (d.children ? -10 : 10))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("font-size", 12)
      .text((d) => d.data.label);
  };

  if (error) {
    return <p className={styles.hint}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <svg ref={svgRef} className={styles.svg} />
      {loading && <p className={styles.hint}>載入中...</p>}
    </div>
  );
}
