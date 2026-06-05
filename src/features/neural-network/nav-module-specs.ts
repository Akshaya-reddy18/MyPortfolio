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
  { navId: "projects", appId: "projects", entryType: "project", icon: FolderKanban, layoutWeight: 1.4 },
  { navId: "skills", appId: "skills", entryType: "skill", icon: Layers },
  { navId: "experience", appId: "experience", entryType: "experience", icon: Briefcase },
  { navId: "achievements", appId: "profile", entryType: "achievement", icon: Award },
  { navId: "education", appId: "profile", entryType: "education", icon: BookOpen },
  { navId: "resume", appId: "resume", icon: FileText },
  { navId: "contact", appId: "contact", icon: Mail },
];

export const NEURAL_CORE_NODE_ID = "neural-core";
export const PROFILE_APP_ID = "profile";
