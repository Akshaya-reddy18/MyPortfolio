import type { AppWindowProps } from "@/features/desktop/types";
import { AppEmpty, AppFrame, AppSection } from "./components/AppLayout";
import { AppGateWithCollections } from "./components/AppGate";
import "./apps.css";

export function ExperienceApp(_props: AppWindowProps) {
  return (
    <AppGateWithCollections>
      {({ collections }) => {
        const experiences = collections.experiences;

        if (experiences.length === 0) {
          return (
            <AppFrame>
              <AppEmpty message="No experience entries in portfolio data." />
            </AppFrame>
          );
        }

        return (
          <AppFrame>
            <AppSection title="Experience" eyebrow={`${experiences.length} roles`}>
              <div className="experience-timeline">
                {experiences.map((exp, index) => (
                  <article
                    key={`${exp.company}-${exp.title}-${index}`}
                    className="experience-item"
                  >
                    <p className="experience-item__duration">{exp.duration}</p>
                    <h3 className="experience-item__title">{exp.title}</h3>
                    <p className="experience-item__company">{exp.company}</p>
                    <p className="experience-item__details">{exp.details}</p>
                  </article>
                ))}
              </div>
            </AppSection>
          </AppFrame>
        );
      }}
    </AppGateWithCollections>
  );
}
