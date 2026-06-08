import {
  Award,
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  Layers,
  Mail,
} from "lucide-react";
import type { NavModuleSpec } from "./types";

export const NAV_MODULE_SPECS: NavModuleSpec[] = [
  { navId: "projects", appId: "projects", entryType: "project", icon: FolderKanban, tier: "primary" },
  { navId: "skills", appId: "skills", entryType: "skill", icon: Layers, tier: "primary" },
  { navId: "experience", appId: "experience", entryType: "experience", icon: Briefcase, tier: "primary" },
  { navId: "achievements", appId: "profile", entryType: "achievement", icon: Award, tier: "tertiary", profileSection: "achievements" },
  { navId: "education", appId: "profile", entryType: "education", icon: BookOpen, tier: "tertiary", profileSection: "education" },
  { navId: "resume", appId: "resume", icon: FileText, tier: "tertiary" },
  { navId: "contact", appId: "contact", icon: Mail, tier: "tertiary" },
];

export const NEURAL_CORE_NODE_ID = "neural-core";
export const PROFILE_APP_ID = "profile";
