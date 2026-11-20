const rawBase = import.meta.env.BASE_URL || "/";
const normalizedBase = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

export function withBase(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return `${normalizedBase}${clean}`;
}

export function getRoutePath(pathname: string = window.location.pathname): string {
  const basePrefix = normalizedBase.slice(0, -1);
  let route = pathname;
  if (basePrefix && route.startsWith(basePrefix)) {
    route = route.slice(basePrefix.length);
  }
  route = route.replace(/\/+$/, "");
  return route || "/";
}

export function getDoctorSlugFromRoute(route: string): string | null {
  const match = route.match(/^\/doctors\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}
