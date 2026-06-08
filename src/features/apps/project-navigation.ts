let pendingProjectTitle: string | null = null;

export function setProjectsFocus(title: string): void {
  pendingProjectTitle = title;
}

export function consumeProjectsFocus(): string | null {
  const title = pendingProjectTitle;
  pendingProjectTitle = null;
  return title;
}
