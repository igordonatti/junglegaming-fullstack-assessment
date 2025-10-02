type TokenBundle = { accessToken: string | null; refreshToken: string | null };

const ACCESS_KEY = "jg_access_token";
const REFRESH_KEY = "jg_refresh_token";

let refreshingPromise: Promise<unknown> | null = null;

export function getTokens(): TokenBundle {
  if (typeof localStorage === "undefined")
    return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem(ACCESS_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
  };
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
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
