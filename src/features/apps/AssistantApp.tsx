import type { AppWindowProps } from "@/features/desktop/types";
import { AssistantPanel } from "@/features/assistant/AssistantPanel";
import "@/features/assistant/assistant-panel.css";
import { AppFrame } from "./components/AppLayout";
import { AppGate } from "./components/AppGate";

export function AssistantApp(_props: AppWindowProps) {
  return (
    <AppGate>
      {(document) => {
        const appConfig = document.applications.assistant;

        if (!appConfig.enabled) {
          return (
            <AppFrame>
              <p className="akshaya-type-body-sm text-muted-foreground">
                NEURAL Assistant is currently disabled.
              </p>
            </AppFrame>
          );
        }

        return (
          <div className="h-full p-3">
            <AssistantPanel
              document={document}
              onClose={() => {}}
              onMinimize={() => {}}
            />
          </div>
        );
      }}
    </AppGate>
  );
}
