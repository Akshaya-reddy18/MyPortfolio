import type { AppWindowProps } from "@/features/desktop/types";
import { AppCard, AppEmpty, AppFrame, AppSection, TagList } from "./components/AppLayout";
import { AppGateWithCollections } from "./components/AppGate";
import { parseCommaList } from "./utils";
import "./apps.css";

export function SkillsApp(_props: AppWindowProps) {
  return (
    <AppGateWithCollections>
      {({ collections }) => {
        const skills = collections.skills;

        if (skills.length === 0) {
          return (
            <AppFrame>
              <AppEmpty message="No skills in portfolio data." />
            </AppFrame>
          );
        }

        return (
          <AppFrame>
            <AppSection title="Skills" eyebrow={`${skills.length} domains`}>
              <div className="skills-grid">
                {skills.map((skill) => (
                  <AppCard key={skill.name} className="skill-card">
                    <p className="skill-card__name">{skill.name}</p>
                    <TagList
                      items={parseCommaList(skill.details)}
                      variant="cyan"
                    />
                  </AppCard>
                ))}
              </div>
            </AppSection>
          </AppFrame>
        );
      }}
    </AppGateWithCollections>
  );
}
