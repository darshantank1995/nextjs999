// utils/checkAuth.js
export function checkAuth(router) {
  const raw = localStorage.getItem("auth") || sessionStorage.getItem("auth");

  if (!raw) {
    router.push("/login");
    return false;
  }

  try {
    const auth = JSON.parse(raw);
    // check expiry
    if (!auth?.accessToken || Date.now() > auth.expiresAt) {
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
      router.push("/login");
      return false;
    }
  } catch {
    router.push("/login");
    return false;
  }

  return true; // ✅ user is valid
}
