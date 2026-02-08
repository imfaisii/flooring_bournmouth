const SESSION_KEY = "flooring_viz_session";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return crypto.randomUUID();
  }

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}
