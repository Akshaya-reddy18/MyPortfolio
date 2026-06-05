import {
  Briefcase,
  Bot,
  FileText,
  FolderKanban,
  Layers,
  Mail,
  Terminal,
  User,
} from "lucide-react";
import type { AppDefinition, AppId } from "./types";
import {
  AssistantApp,
  ContactApp,
  ExperienceApp,
  ProfileApp,
  ProjectsApp,
  ResumeApp,
  SkillsApp,
  TerminalApp,
} from "@/features/apps";

const registry = new Map<AppId, AppDefinition>();

export function registerApp(definition: AppDefinition): void {
  registry.set(definition.id, definition);
}

export function getApp(appId: AppId): AppDefinition | undefined {
  return registry.get(appId);
}

export function getAllApps(): AppDefinition[] {
  return Array.from(registry.values());
}

registerApp({
  id: "profile",
  title: "Profile",
  icon: User,
  defaultSize: { width: 720, height: 680 },
  component: ProfileApp,
  singleton: true,
  themeClass: "app-theme--profile",
});

registerApp({
  id: "projects",
  title: "Projects",
  icon: FolderKanban,
  defaultSize: { width: 960, height: 640 },
  component: ProjectsApp,
  singleton: true,
  themeClass: "app-theme--projects",
});

registerApp({
  id: "skills",
  title: "Skills",
  icon: Layers,
  defaultSize: { width: 640, height: 560 },
  component: SkillsApp,
  singleton: true,
  themeClass: "app-theme--skills",
});

registerApp({
  id: "experience",
  title: "Experience",
  icon: Briefcase,
  defaultSize: { width: 880, height: 600 },
  component: ExperienceApp,
  singleton: true,
  themeClass: "app-theme--experience",
});

registerApp({
  id: "contact",
  title: "Contact",
  icon: Mail,
  defaultSize: { width: 500, height: 600 },
  component: ContactApp,
  singleton: true,
  themeClass: "app-theme--contact",
});

registerApp({
  id: "resume",
  title: "Resume",
  icon: FileText,
  defaultSize: { width: 820, height: 860 },
  component: ResumeApp,
  singleton: true,
  themeClass: "app-theme--resume",
});

registerApp({
  id: "assistant",
  title: "NEURAL Assistant",
  icon: Bot,
  defaultSize: { width: 560, height: 640 },
  component: AssistantApp,
  singleton: true,
  showInDock: false,
  themeClass: "app-theme--assistant",
});

registerApp({
  id: "terminal",
  title: "Terminal",
  icon: Terminal,
  defaultSize: { width: 920, height: 560 },
  component: TerminalApp,
  singleton: true,
  themeClass: "app-theme--terminal",
});
