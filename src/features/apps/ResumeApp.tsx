import { Download, ExternalLink } from "lucide-react";
import type { AppWindowProps } from "@/features/desktop/types";
import { AppEmpty, AppFrame, AppSection } from "./components/AppLayout";
import { AppGate } from "./components/AppGate";
import "./apps.css";

export function ResumeApp(_props: AppWindowProps) {
  return (
    <AppGate>
      {(document) => {
        const { resume, applications } = document;
        const appConfig = applications.resume;

        if (!appConfig.enabled) {
          return (
            <AppFrame>
              <AppEmpty message="Resume application is disabled in portfolio configuration." />
            </AppFrame>
          );
        }

        const { file } = resume;
        const allowDownload = appConfig.viewer.allowDownload;
        const isPdf = file.mimeType.includes("pdf");
        const useEmbed = appConfig.viewer.mode === "embed" && isPdf;

        return (
          <AppFrame className="flex flex-col h-full">
            <AppSection title={resume.title}>
              <div className="resume-toolbar">
                <div>
                  <p className="akshaya-type-caption text-muted-foreground">
                    Last updated {resume.lastUpdated}
                  </p>
                  {resume.languages.length > 0 && (
                    <p className="akshaya-type-caption text-muted-foreground">
                      Languages: {resume.languages.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allowDownload && (
                    <a
                      href={file.url}
                      download
                      className="resume-download-btn akshaya-focus-ring"
                    >
                      <Download className="h-4 w-4" />
                      {file.label}
                    </a>
                  )}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-download-btn akshaya-focus-ring"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in new tab
                  </a>
                </div>
              </div>

              {useEmbed ? (
                <div className="resume-viewer">
                  <iframe
                    src={file.url}
                    title={resume.title}
                    aria-label={`${resume.title} PDF viewer`}
                  />
                </div>
              ) : (
                <div className="app-empty flex-col gap-3">
                  <p className="akshaya-type-body-sm text-center max-w-sm">
                    {appConfig.description}. Use the buttons above to view or download
                    your resume ({file.mimeType}).
                  </p>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-download-btn akshaya-focus-ring"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {file.label}
                  </a>
                </div>
              )}
            </AppSection>
          </AppFrame>
        );
      }}
    </AppGate>
  );
}
