import { useState } from "react";
import type { AppWindowProps } from "@/features/desktop/types";
import type { ProjectEntry } from "@/types";
import { AppCard, AppEmpty, AppFrame, AppSection, TagList } from "./components/AppLayout";
import { AppGateWithCollections } from "./components/AppGate";
import "./apps.css";

function ProjectDetail({ project }: { project: ProjectEntry }) {
  return (
    <div className="project-detail">
      <h3 className="project-detail__title">{project.title}</h3>
      <p className="project-detail__category">{project.category}</p>

      <p className="project-detail__text mb-4">{project.description}</p>

      <div className="project-detail__impact mb-4">{project.impact}</div>

      <div className="project-detail__block">
        <p className="project-detail__block-title">Details</p>
        <p className="project-detail__text">{project.details}</p>
      </div>

      {project.challenges && (
        <div className="project-detail__block">
          <p className="project-detail__block-title">Challenges</p>
          <p className="project-detail__text">{project.challenges}</p>
        </div>
      )}

      {project.solutions && (
        <div className="project-detail__block">
          <p className="project-detail__block-title">Solutions</p>
          <p className="project-detail__text">{project.solutions}</p>
        </div>
      )}

      <div className="project-detail__block">
        <p className="project-detail__block-title">Tags</p>
        <TagList items={project.tags} variant="purple" />
      </div>

      <div className="project-detail__block">
        <p className="project-detail__block-title">Stack</p>
        <TagList items={project.stack} variant="blue" />
      </div>
    </div>
  );
}

export function ProjectsApp(_props: AppWindowProps) {
  return (
    <AppGateWithCollections>
      {({ collections }) => {
        const projects = collections.projects;
        const [selectedIndex, setSelectedIndex] = useState(0);

        if (projects.length === 0) {
          return (
            <AppFrame>
              <AppEmpty message="No projects in portfolio data." />
            </AppFrame>
          );
        }

        const selected = projects[selectedIndex] ?? projects[0];

        return (
          <AppFrame>
            <AppSection title="Projects" eyebrow={`${projects.length} entries`}>
              <div className="projects-layout">
                <div className="projects-list" role="listbox" aria-label="Project list">
                  {projects.map((project, index) => (
                    <button
                      key={`${project.title}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={`project-list-item ${index === selectedIndex ? "project-list-item--active" : ""}`}
                      onClick={() => setSelectedIndex(index)}
                    >
                      <p className="project-list-item__title">{project.title}</p>
                      <p className="project-list-item__category">{project.category}</p>
                    </button>
                  ))}
                </div>

                <AppCard className="min-h-[20rem]">
                  <ProjectDetail project={selected} />
                </AppCard>
              </div>
            </AppSection>
          </AppFrame>
        );
      }}
    </AppGateWithCollections>
  );
}
