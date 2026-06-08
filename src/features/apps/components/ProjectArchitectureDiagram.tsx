import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import "./project-architecture.css";

export interface ArchitectureNode {
  id: string;
  label: string;
  sublabel?: string;
}

export interface ArchitectureDiagramConfig {
  nodes: ArchitectureNode[];
  compactNodes?: ArchitectureNode[];
}

const DIAGRAM_CONFIGS: Record<string, ArchitectureDiagramConfig> = {
  "ResearchPilot AI": {
    nodes: [
      { id: "user", label: "User" },
      { id: "frontend", label: "React Frontend" },
      { id: "api", label: "FastAPI Gateway" },
      { id: "rag", label: "RAG Pipeline" },
      { id: "embed", label: "Embedding Model" },
      { id: "vector", label: "ChromaDB", sublabel: "Vector Store" },
      { id: "llm", label: "LLaMA-3.3-70B" },
      { id: "response", label: "Response Generation" },
    ],
    compactNodes: [
      { id: "user", label: "User" },
      { id: "frontend", label: "React UI" },
      { id: "rag", label: "RAG + LLM" },
      { id: "vector", label: "ChromaDB" },
      { id: "response", label: "Response" },
    ],
  },
  PulseConnect: {
    nodes: [
      { id: "users", label: "Users" },
      { id: "app", label: "React Application" },
      { id: "supabase", label: "Supabase", sublabel: "Realtime DB" },
      { id: "auth", label: "Authentication" },
      { id: "engine", label: "Donor Matching Engine" },
      { id: "ml", label: "ML Forecasting", sublabel: "Scikit-learn" },
      { id: "notify", label: "Notification System" },
    ],
    compactNodes: [
      { id: "users", label: "Users" },
      { id: "app", label: "React App" },
      { id: "engine", label: "Matching + ML" },
      { id: "notify", label: "Alerts" },
    ],
  },
  StartupConnect: {
    nodes: [
      { id: "users", label: "Users" },
      { id: "react", label: "React + TypeScript" },
      { id: "api", label: "REST APIs" },
      { id: "supabase", label: "Supabase" },
      { id: "match", label: "AI Matching Engine" },
      { id: "auth", label: "Role-Based Auth" },
    ],
  },
};

function buildGenericDiagram(stack: string[]): ArchitectureDiagramConfig {
  const layers: ArchitectureNode[] = stack.slice(0, 6).map((tech, index) => ({
    id: `layer-${index}`,
    label: tech,
  }));

  return {
    nodes: [{ id: "user", label: "User" }, ...layers, { id: "output", label: "Output" }],
    compactNodes: [
      { id: "user", label: "User" },
      ...layers.slice(0, 3),
      { id: "output", label: "Output" },
    ],
  };
}

interface ProjectArchitectureDiagramProps {
  projectTitle: string;
  stack: string[];
  className?: string;
}

export function ProjectArchitectureDiagram({
  projectTitle,
  stack,
  className,
}: ProjectArchitectureDiagramProps) {
  const isMobile = useIsMobile();

  const config = useMemo(() => {
    return DIAGRAM_CONFIGS[projectTitle] ?? buildGenericDiagram(stack);
  }, [projectTitle, stack]);

  const nodes = isMobile && config.compactNodes ? config.compactNodes : config.nodes;

  return (
    <div className={cn("arch-diagram", className)} role="img" aria-label={`${projectTitle} architecture`}>
      <p className="arch-diagram__eyebrow">System Architecture</p>
      <div className="arch-diagram__flow">
        {nodes.map((node, index) => (
          <div key={node.id} className="arch-diagram__stage">
            <div className="arch-diagram__node">
              <span className="arch-diagram__node-label">{node.label}</span>
              {node.sublabel && (
                <span className="arch-diagram__node-sub">{node.sublabel}</span>
              )}
              <span className="arch-diagram__node-glow" aria-hidden />
            </div>
            {index < nodes.length - 1 && (
              <div className="arch-diagram__connector" aria-hidden>
                <span className="arch-diagram__connector-line" />
                <span className="arch-diagram__connector-packet" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
