import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { initialContent } from "./siteData";
const ContentContext = createContext(null);
export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "same-origin",
  });
  const data = await response
    .json()
    .catch(() => ({ error: "The service is unavailable. Please retry." }));
  if (!response.ok) {
    const error = new Error(data.error || "Request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}
export function ContentProvider({ children }) {
  const [content, setContent] = useState(initialContent);
  const [ready, setReady] = useState(false);
  const [offline, setOffline] = useState(false);
  const refresh = useCallback(async () => {
    try {
      setContent(await api("/content"));
      setOffline(false);
    } catch {
      setOffline(true);
    } finally {
      setReady(true);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return (
    <ContentContext.Provider value={{ ...content, ready, offline, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}
export const useContent = () => useContext(ContentContext);
export function SocialLinks() {
  const { settings } = useContent();
  const icons = {
    facebook: "facebook-f",
    instagram: "instagram",
    linkedin: "linkedin-in",
    youtube: "youtube",
  };
  return (
    <div className="footer-socials">
      {Object.entries(icons)
        .filter(([key]) => settings[key])
        .map(([key, icon]) => (
          <a
            key={key}
            href={settings[key]}
            aria-label={key}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={`fa-brands fa-${icon}`} />
          </a>
        ))}
    </div>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container sub-bar-flex">
        <p>
          © {new Date().getFullYear()} R Bukhari Creative Institute. All rights
          reserved.
        </p>
        <div className="footer-actions">
          <a href="/contact">Contact admissions</a>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
