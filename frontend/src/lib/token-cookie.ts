const TOKEN_COOKIE = "accessToken";
const COOKIE_PATH = "/";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setTokenCookie(token: string) {
  document.cookie = `${TOKEN_COOKIE}=${token};path=${COOKIE_PATH};max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

export function removeTokenCookie() {
  document.cookie = `${TOKEN_COOKIE}=;path=${COOKIE_PATH};max-age=0;SameSite=Lax`;
}
