import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AppWindowProps } from "@/features/desktop/types";
import type { ProjectEntry } from "@/types";
import { ProjectArchitectureDiagram } from "./components/ProjectArchitectureDiagram";
import { AppCard, AppEmpty, AppFrame, AppSection, TagList } from "./components/AppLayout";
import { AppGateWithCollections } from "./components/AppGate";
import { consumeProjectsFocus } from "./project-navigation";
import "./components/project-architecture.css";
import "./apps.css";

const CATEGORY_ORDER = [
  "AI Systems",
  "AI + Healthcare",
  "Full Stack",
  "DevOps",
  "Data Analytics",
] as const;

const CATEGORY_FILTERS = ["All", ...CATEGORY_ORDER] as const;

function ProjectDetail({ project }: { project: ProjectEntry }) {
  return (
    <div className="project-detail">
      <h3 className="project-detail__title">{project.title}</h3>
      <p className="project-detail__category">{project.category}</p>

      <div className="project-detail__section">
        <p className="project-detail__block-title">Overview</p>
        <p className="project-detail__text">{project.description}</p>
      </div>

      <ProjectArchitectureDiagram projectTitle={project.title} stack={project.stack} />

      <div className="project-detail__section">
        <p className="project-detail__block-title">Tech Stack</p>
        <TagList items={project.stack} variant="blue" />
      </div>

      <div className="project-detail__section">
        <p className="project-detail__block-title">Architecture & Implementation</p>
        <p className="project-detail__text">{project.details}</p>
      </div>

      {project.challenges && (
        <div className="project-detail__section">
          <p className="project-detail__block-title">Challenges</p>
          <p className="project-detail__text">{project.challenges}</p>
        </div>
      )}

      {project.solutions && (
        <div className="project-detail__section">
          <p className="project-detail__block-title">Solutions</p>
          <p className="project-detail__text">{project.solutions}</p>
        </div>
      )}

      <div className="project-detail__impact project-detail__section">{project.impact}</div>

      <div className="project-detail__section">
        <p className="project-detail__block-title">Results & Impact</p>
        <p className="project-detail__text">{project.impact}</p>
      </div>

      <div className="project-detail__section">
        <p className="project-detail__block-title">Tags</p>
        <TagList items={project.tags} variant="purple" />
      </div>
    </div>
  );
}

function groupProjectsByCategory(projects: ProjectEntry[]) {
  const groups = new Map<string, ProjectEntry[]>();

  for (const project of projects) {
    const list = groups.get(project.category) ?? [];
    list.push(project);
    groups.set(project.category, list);
  }

  const ordered = CATEGORY_ORDER.filter((category) => groups.has(category)).map(
    (category) => ({
      category,
      projects: groups.get(category) ?? [],
    }),
  );

  const extras = [...groups.keys()]
    .filter((category) => !CATEGORY_ORDER.includes(category as (typeof CATEGORY_ORDER)[number]))
    .map((category) => ({ category, projects: groups.get(category) ?? [] }));

  return [...ordered, ...extras];
}

export function ProjectsApp(_props: AppWindowProps) {
  return (
    <AppGateWithCollections>
      {({ collections }) => {
        const projects = collections.projects;
        const [query, setQuery] = useState("");
        const [categoryFilter, setCategoryFilter] = useState<string>("All");
        const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
          Object.fromEntries(CATEGORY_ORDER.map((c) => [c, true])),
        );
        const [selectedId, setSelectedId] = useState<string | null>(null);

        useEffect(() => {
          const focus = consumeProjectsFocus();
          if (focus) setSelectedId(focus);
        }, []);

        const filtered = useMemo(() => {
          const q = query.trim().toLowerCase();
          return projects.filter((p) => {
            const matchesQuery =
              !q ||
              p.title.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              p.stack.some((s) => s.toLowerCase().includes(q));
            const matchesCategory =
              categoryFilter === "All" || p.category === categoryFilter;
            return matchesQuery && matchesCategory;
          });
        }, [projects, query, categoryFilter]);

        const groups = useMemo(() => groupProjectsByCategory(filtered), [filtered]);

        const selected = useMemo(() => {
          if (selectedId) {
            const match = projects.find((p) => p.title === selectedId);
            if (match) return match;
          }
          return groups[0]?.projects[0] ?? projects[0];
        }, [selectedId, projects, groups]);

        if (projects.length === 0) {
          return (
            <AppFrame>
              <AppEmpty message="No projects in portfolio data." />
            </AppFrame>
          );
        }

        return (
          <AppFrame className="projects-app">
            <AppSection title="Research Lab" eyebrow={`${projects.length} experiments`}>
              <div className="projects-lab-header">
                <p className="projects-lab-header__desc">
                  Engineering showcase — AI systems, healthcare ML, full-stack platforms, and data pipelines.
                </p>
                <div className="projects-lab-header__controls">
                  <label className="projects-search">
                    <Search className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />
                    <input
                      type="search"
                      className="projects-search__input"
                      placeholder="Search projects, stacks…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="Search projects"
                    />
                  </label>
                  <div className="projects-filters" role="group" aria-label="Filter by category">
                    {CATEGORY_FILTERS.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        className={`projects-filter ${categoryFilter === filter ? "projects-filter--active" : ""}`}
                        onClick={() => setCategoryFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="projects-layout projects-layout--lab">
                <div className="projects-lab-sidebar" role="listbox" aria-label="Project categories">
                  {groups.length === 0 ? (
                    <p className="akshaya-type-body-sm text-muted-foreground px-2">
                      No projects match your filters.
                    </p>
                  ) : (
                    groups.map((group) => {
                      const isOpen = expanded[group.category] ?? true;
                      return (
                        <div key={group.category} className="projects-category">
                          <button
                            type="button"
                            className="projects-category__header"
                            onClick={() =>
                              setExpanded((prev) => ({
                                ...prev,
                                [group.category]: !isOpen,
                              }))
                            }
                            aria-expanded={isOpen}
                          >
                            <span className="projects-category__title">{group.category}</span>
                            <span className="projects-category__count">{group.projects.length}</span>
                            <ChevronDown
                              className={`projects-category__chevron ${isOpen ? "projects-category__chevron--open" : ""}`}
                              aria-hidden
                            />
                          </button>

                          {isOpen && (
                            <div className="projects-category__list">
                              {group.projects.map((project) => (
                                <button
                                  key={project.title}
                                  type="button"
                                  role="option"
                                  aria-selected={selected?.title === project.title}
                                  className={`project-list-item ${selected?.title === project.title ? "project-list-item--active" : ""}`}
                                  onClick={() => setSelectedId(project.title)}
                                >
                                  <p className="project-list-item__title">{project.title}</p>
                                  <p className="project-list-item__category">{project.impact}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <AppCard className="projects-lab-detail min-h-[22rem]">
                  {selected ? (
                    <ProjectDetail project={selected} />
                  ) : (
                    <AppEmpty message="Select a project to inspect." />
                  )}
                </AppCard>
              </div>
            </AppSection>
          </AppFrame>
        );
      }}
    </AppGateWithCollections>
  );
}
