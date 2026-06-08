let pendingSection: string | null = null;

export function setProfileScrollTarget(section: string): void {
  pendingSection = section;
}

export function consumeProfileScrollTarget(): string | null {
  const section = pendingSection;
  pendingSection = null;
  return section;
}
