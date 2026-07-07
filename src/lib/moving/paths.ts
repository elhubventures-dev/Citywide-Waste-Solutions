/** Build correct href for relocate section (subdomain vs /relocate preview path). */
export function relocateHref(path: string, host?: string): string {
  const normalized = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const isRelocateHost = host?.includes("relocate.") ?? false;
  return isRelocateHost ? normalized || "/" : `/relocate${normalized}`;
}

export function isRelocateHost(host: string): boolean {
  return host.includes("relocate.");
}
