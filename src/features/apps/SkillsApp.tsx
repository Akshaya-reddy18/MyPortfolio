import { useMemo, useState } from "react";
import type { AppWindowProps } from "@/features/desktop/types";
import { AppEmpty, AppFrame, AppSection, TagList } from "./components/AppLayout";
import { AppGateWithCollections } from "./components/AppGate";
import { parseCommaList } from "./utils";
import "./apps.css";

export function SkillsApp(_props: AppWindowProps) {
  return (
    <AppGateWithCollections>
      {({ collections }) => {
        const skills = collections.skills;
        const [activeCluster, setActiveCluster] = useState(0);

        const clusters = useMemo(
          () =>
            skills.map((skill, index) => ({
              id: skill.name,
              name: skill.name,
              items: parseCommaList(skill.details),
              hue: index % 3,
            })),
          [skills],
        );

        if (skills.length === 0) {
          return (
            <AppFrame>
              <AppEmpty message="No skills in portfolio data." />
            </AppFrame>
          );
        }

        const active = clusters[activeCluster] ?? clusters[0];

        return (
          <AppFrame className="skills-app">
            <AppSection title="Knowledge Graph" eyebrow={`${skills.length} clusters`}>
              <div className="skills-cluster-layout">
                <div className="skills-cluster-viz" aria-hidden>
                  <div className="skills-cluster-viz__hub">
                    <span className="skills-cluster-viz__hub-label">ML Stack</span>
                  </div>
                  {clusters.map((cluster, index) => {
                    const angle = (index / clusters.length) * Math.PI * 2 - Math.PI / 2;
                    const radius = 42;
                    const x = 50 + Math.cos(angle) * radius;
                    const y = 50 + Math.sin(angle) * radius;
                    const isActive = index === activeCluster;

                    return (
                      <button
                        key={cluster.id}
                        type="button"
                        className={`skills-cluster-node skills-cluster-node--hue-${cluster.hue} ${isActive ? "skills-cluster-node--active" : ""}`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        onClick={() => setActiveCluster(index)}
                        aria-label={`View ${cluster.name} cluster`}
                        aria-pressed={isActive}
                      >
                        <span className="skills-cluster-node__dot" />
                        <span className="skills-cluster-node__name">{cluster.name}</span>
                      </button>
                    );
                  })}
                  <svg className="skills-cluster-viz__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {clusters.map((cluster, index) => {
                      const angle = (index / clusters.length) * Math.PI * 2 - Math.PI / 2;
                      const x2 = 50 + Math.cos(angle) * 42;
                      const y2 = 50 + Math.sin(angle) * 42;
                      return (
                        <line
                          key={cluster.id}
                          x1="50"
                          y1="50"
                          x2={x2}
                          y2={y2}
                          className={index === activeCluster ? "skills-cluster-line--active" : ""}
                        />
                      );
                    })}
                  </svg>
                </div>

                <div className="skills-cluster-panel">
                  <h3 className="skills-cluster-panel__title">{active?.name}</h3>
                  <p className="skills-cluster-panel__meta">
                    {active?.items.length ?? 0} technologies in this cluster
                  </p>
                  <TagList items={active?.items ?? []} variant="cyan" />
                </div>
              </div>
            </AppSection>
          </AppFrame>
        );
      }}
    </AppGateWithCollections>
  );
}
