type TokenBundle = { access_token: string | null; refreshToken: string | null };

const ACCESS_KEY = "jg_access_token";
const REFRESH_KEY = "jg_refresh_token";

let refreshingPromise: Promise<unknown> | null = null;

export function getTokens(): TokenBundle {
  if (typeof localStorage === "undefined")
    return { access_token: null, refreshToken: null };
  return {
    access_token: localStorage.getItem(ACCESS_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
  };
}

export function setTokens(tokens: {
  access_token: string;
  refreshToken: string;
}) {
  if (typeof localStorage === "undefined") return;
  console.log("SET TOKENS", tokens.access_token);
  localStorage.setItem(ACCESS_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isRefreshingToken() {
  return refreshingPromise;
}

export function setRefreshingTokenPromise(promise: Promise<unknown> | null) {
  refreshingPromise = promise;
}

export type DecodedUser = {
  id?: string;
  sub?: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
};

export function decodeJwt(token: string | null): DecodedUser | null {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as DecodedUser;
  } catch {
    return null;
  }
}

export function getCurrentUserId(): string | null {
  const { access_token } = getTokens();
  const decoded = decodeJwt(access_token);
  if (!decoded) return null;
  const candidate = (decoded.id as string) || (decoded.sub as string) || null;
  return typeof candidate === "string" ? candidate : null;
}
