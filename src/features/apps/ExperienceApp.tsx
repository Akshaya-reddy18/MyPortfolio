import { useCallback } from "react";
import type { AppWindowProps } from "@/features/desktop/types";
import type { ExperienceEntry, ProjectEntry } from "@/types";
import { useWindowManager } from "@/features/desktop/window-manager/window-manager-context";
import { AppEmpty, AppFrame, AppSection, TagList } from "./components/AppLayout";
import { AppGateWithCollections } from "./components/AppGate";
import { setProjectsFocus } from "./project-navigation";
import "./apps.css";

function ExperienceRoleCard({
  experience,
  projects,
  onOpenProject,
}: {
  experience: ExperienceEntry;
  projects: ProjectEntry[];
  onOpenProject: (title: string) => void;
}) {
  const linkedProjects = (experience.relatedProjectTitles ?? [])
    .map((title) => projects.find((p) => p.title === title))
    .filter((p): p is ProjectEntry => p != null);

  const roleProjects = experience.roleProjects ?? [];
  const technologies = experience.technologies ?? [];
  const outcomes = experience.outcomes ?? [];

  return (
    <article className="experience-role">
      <div className="experience-role__header">
        <div>
          <h3 className="experience-role__title">{experience.title}</h3>
          <p className="experience-role__company">{experience.company}</p>
        </div>
        <span className="experience-role__duration">{experience.duration}</span>
      </div>

      <p className="experience-role__summary">{experience.details}</p>

      {technologies.length > 0 && (
        <div className="experience-role__block">
          <p className="experience-role__label">Technologies</p>
          <TagList items={technologies} variant="cyan" />
        </div>
      )}

      {(roleProjects.length > 0 || linkedProjects.length > 0) && (
        <div className="experience-role__block">
          <p className="experience-role__label">Projects Built</p>
          <ul className="experience-role__projects">
            {roleProjects.map((item) => {
              const linked = item.linkedProjectTitle
                ? projects.find((p) => p.title === item.linkedProjectTitle)
                : projects.find((p) => p.title === item.title);

              return (
                <li key={item.title}>
                  {linked ? (
                    <button
                      type="button"
                      className="experience-role__project-btn"
                      onClick={() => onOpenProject(linked.title)}
                    >
                      <span className="experience-role__project-title">{item.title}</span>
                      <span className="experience-role__project-summary">{item.summary}</span>
                    </button>
                  ) : (
                    <div className="experience-role__project-static">
                      <span className="experience-role__project-title">{item.title}</span>
                      <span className="experience-role__project-summary">{item.summary}</span>
                    </div>
                  )}
                </li>
              );
            })}
            {linkedProjects
              .filter((p) => !roleProjects.some((rp) => rp.title === p.title))
              .map((project) => (
                <li key={project.title}>
                  <button
                    type="button"
                    className="experience-role__project-btn"
                    onClick={() => onOpenProject(project.title)}
                  >
                    <span className="experience-role__project-title">{project.title}</span>
                    <span className="experience-role__project-summary">{project.impact}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}

      {outcomes.length > 0 && (
        <div className="experience-role__block experience-role__block--impact">
          <p className="experience-role__label">Impact Highlights</p>
          <ul className="experience-role__outcomes">
            {outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="experience-recruiter" aria-label="Recruiter summary">
        <p className="experience-recruiter__label">Recruiter Snapshot</p>
        <div className="experience-recruiter__grid">
          <div>
            <span className="experience-recruiter__key">Role</span>
            <span className="experience-recruiter__val">{experience.title}</span>
          </div>
          <div>
            <span className="experience-recruiter__key">Stack</span>
            <span className="experience-recruiter__val">
              {technologies.slice(0, 4).join(" · ") || "—"}
            </span>
          </div>
          <div>
            <span className="experience-recruiter__key">Projects</span>
            <span className="experience-recruiter__val">
              {roleProjects.length + linkedProjects.length || "—"}
            </span>
          </div>
          <div>
            <span className="experience-recruiter__key">Top Impact</span>
            <span className="experience-recruiter__val">{outcomes[0] ?? experience.details}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ExperienceApp(_props: AppWindowProps) {
  const { openAppFromNeural } = useWindowManager();

  const handleOpenProject = useCallback(
    (title: string) => {
      setProjectsFocus(title);
      openAppFromNeural("projects");
    },
    [openAppFromNeural],
  );

  return (
    <AppGateWithCollections>
      {({ collections }) => {
        const experiences = collections.experiences;
        const projects = collections.projects;

        if (experiences.length === 0) {
          return (
            <AppFrame>
              <AppEmpty message="No experience entries in portfolio data." />
            </AppFrame>
          );
        }

        return (
          <AppFrame className="experience-app">
            <AppSection title="Career Timeline" eyebrow={`${experiences.length} roles`}>
              <p className="experience-app__intro">
                Each role maps to technologies, projects built, and measurable impact — designed for
                quick recruiter scanning.
              </p>
              <div className="experience-timeline experience-timeline--story">
                {experiences.map((exp, index) => (
                  <ExperienceRoleCard
                    key={`${exp.company}-${exp.title}-${index}`}
                    experience={exp}
                    projects={projects}
                    onOpenProject={handleOpenProject}
                  />
                ))}
              </div>
            </AppSection>
          </AppFrame>
        );
      }}
    </AppGateWithCollections>
  );
}
