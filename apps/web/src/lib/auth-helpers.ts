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
