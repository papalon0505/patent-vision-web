"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
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

  useEffect(() => {
    if (!svgRef.current) return;

    // SSE streaming from API
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/ai/mindmap/${patentId}`
    );

    let rootNode: MindMapNode | null = null;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "start") {
        rootNode = { id: "root", label: data.title || patentId };
      } else if (data.type === "node" && rootNode) {
        // Add node to tree
        const newNode: MindMapNode = {
          id: data.id,
          label: data.label,
        };
        
        if (!rootNode.children) {
          rootNode.children = [];
        }
        rootNode.children.push(newNode);
        
        renderMindMap(rootNode);
      } else if (data.type === "done") {
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
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

  return (
    <div className={styles.container}>
      <svg ref={svgRef} className={styles.svg} />
      <p className={styles.hint}>載入中...</p>
    </div>
  );
}