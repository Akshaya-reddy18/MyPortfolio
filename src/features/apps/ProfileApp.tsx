import { ExternalLink } from "lucide-react";
import { useEffect } from "react";
import type { AppWindowProps } from "@/features/desktop/types";
import { buildPortfolioMeta, getAchievements, getEducation } from "@/lib/portfolio";
import { AppCard, AppFrame, AppSection, TagList } from "./components/AppLayout";
import { AppGateWithCollections } from "./components/AppGate";
import { consumeProfileScrollTarget } from "./profile-scroll";
import "./apps.css";

export function ProfileApp(_props: AppWindowProps) {
  useEffect(() => {
    const section = consumeProfileScrollTarget();
    if (!section) return;

    const timer = window.setTimeout(() => {
      document.getElementById(`profile-${section}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);
  return (
    <AppGateWithCollections>
      {({ document }) => {
        const { profile, hero, currentFocus } = document.neuralCore;
        const meta = buildPortfolioMeta(document.entries);
        const education = getEducation(document.entries);
        const achievements = getAchievements(document.entries);

        return (
          <AppFrame className="profile-app">
            <section className="profile-premium-hero">
              <div className="profile-premium-hero__visual">
                <div className="profile-premium-hero__ring profile-premium-hero__ring--outer" aria-hidden />
                <div className="profile-premium-hero__ring profile-premium-hero__ring--inner" aria-hidden />
                <div
                  className="profile-premium-hero__avatar"
                  style={{ backgroundImage: `url("${profile.avatar.src}")` }}
                  role="img"
                  aria-label={profile.avatar.alt}
                />
              </div>

              <div className="profile-premium-hero__content">
                <p className="profile-premium-hero__eyebrow">AI Engineer Profile</p>
                <h1 className="profile-premium-hero__name">{profile.name}</h1>
                <p className="profile-premium-hero__role">{profile.role}</p>
                <p className="profile-premium-hero__headline">{profile.headline}</p>
                <span
                  className={`profile-premium-hero__status profile-premium-hero__status--${profile.status.state}`}
                >
                  <span className="profile-premium-hero__status-dot" aria-hidden />
                  {profile.status.label}
                </span>
              </div>
            </section>

            <div className="profile-metrics">
              <div className="profile-metric">
                <p className="profile-metric__value">{meta.counts.project}</p>
                <p className="profile-metric__label">Projects</p>
              </div>
              <div className="profile-metric">
                <p className="profile-metric__value">{meta.counts.skill}</p>
                <p className="profile-metric__label">Skill Domains</p>
              </div>
              <div className="profile-metric">
                <p className="profile-metric__value">{meta.counts.experience}</p>
                <p className="profile-metric__label">Roles</p>
              </div>
              <div className="profile-metric">
                <p className="profile-metric__value">{meta.allStack.length}</p>
                <p className="profile-metric__label">Stack Tools</p>
              </div>
            </div>

            <AppSection title="About" eyebrow="Neural Core">
              <p className="akshaya-type-body profile-premium-bio">{profile.bio}</p>
              {hero.highlights.length > 0 && (
                <div className="mt-4">
                  <TagList items={hero.highlights} variant="cyan" />
                </div>
              )}
            </AppSection>

            <AppSection title={currentFocus.title} eyebrow="Current Focus">
              <p className="akshaya-type-body-sm mb-4 text-muted-foreground">
                {currentFocus.summary}
              </p>
              <ul className="profile-focus-list profile-focus-list--premium">
                {currentFocus.items
                  .slice()
                  .sort((a, b) => a.priority - b.priority)
                  .map((item) => (
                    <li key={item.label} className="profile-focus-item profile-focus-item--premium">
                      <span className="profile-focus-item__priority">
                        {String(item.priority).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="akshaya-type-body-sm font-medium text-foreground">
                          {item.label}
                        </p>
                        <p className="akshaya-type-caption">{item.detail}</p>
                      </div>
                    </li>
                  ))}
              </ul>
            </AppSection>

            {education.length > 0 && (
              <AppSection id="profile-education" title="Education" eyebrow="Credentials">
                {education.map((entry, i) => (
                  <AppCard key={i} className="profile-education-card mb-3">
                    <p className="profile-entry-text">{entry.details}</p>
                  </AppCard>
                ))}
              </AppSection>
            )}

            {document.social.length > 0 && (
              <AppSection title="Social" eyebrow="Connect">
                <div className="profile-social-list profile-social-list--premium">
                  {document.social.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-social-link profile-social-link--premium akshaya-focus-ring"
                    >
                      <span>
                        <span className="akshaya-type-body-sm font-medium text-foreground">
                          {link.platform}
                        </span>
                        {link.handle && (
                          <span className="akshaya-type-caption block">{link.handle}</span>
                        )}
                      </span>
                      <ExternalLink className="h-4 w-4 shrink-0 opacity-60" />
                    </a>
                  ))}
                </div>
              </AppSection>
            )}

            {achievements.length > 0 && (
              <AppSection id="profile-achievements" title="Achievements">
                <div className="profile-achievements-grid">
                  {achievements.map((entry) => (
                    <AppCard key={entry.title} className="profile-achievement-card">
                      <p className="akshaya-type-body-sm font-medium text-foreground mb-1">
                        {entry.title}
                      </p>
                      <p className="profile-entry-text">{entry.details}</p>
                    </AppCard>
                  ))}
                </div>
              </AppSection>
            )}

            <div className="profile-meta-grid profile-meta-grid--premium">
              <div className="profile-meta-item">
                <p className="profile-meta-item__label">Location</p>
                <p className="profile-meta-item__value">{profile.location}</p>
              </div>
              <div className="profile-meta-item">
                <p className="profile-meta-item__label">Timezone</p>
                <p className="profile-meta-item__value">{profile.timezone}</p>
              </div>
              <div className="profile-meta-item">
                <p className="profile-meta-item__label">Tagline</p>
                <p className="profile-meta-item__value">{profile.tagline}</p>
              </div>
            </div>
          </AppFrame>
        );
      }}
    </AppGateWithCollections>
  );
}
