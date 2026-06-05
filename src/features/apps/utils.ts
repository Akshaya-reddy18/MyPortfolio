/** Parse comma-separated skill/detail strings from portfolio JSON */
export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Resolve mailto template placeholders from portfolio document */
export function resolveMailtoTemplate(
  template: string,
  contactEmail: string,
): string {
  return template.replace(/\{\{contact\.email\}\}/g, contactEmail);
}

export function buildMailtoUrl(
  to: string,
  subject: string,
  bodyFields?: Record<string, string>,
): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (bodyFields && Object.keys(bodyFields).length > 0) {
    params.set(
      "body",
      Object.entries(bodyFields)
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n\n"),
    );
  }
  const qs = params.toString();
  return `mailto:${to}${qs ? `?${qs}` : ""}`;
}

export function groupProjectsByCategory<T extends { category: string }>(
  projects: T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const project of projects) {
    const list = map.get(project.category) ?? [];
    list.push(project);
    map.set(project.category, list);
  }
  return map;
}
