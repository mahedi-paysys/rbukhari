import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Faculty from "./pages/Faculty";
import About from "./pages/About";
import Admissions from "./pages/Admissions";
import Verify from "./pages/Verify";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { ContentProvider, useContent } from "./content";
import "../style.css";
import "./enhancements.css";
import "./motion.css";
import "./workspace.css";
import { useSiteMotion } from "./useSiteMotion";

const pages = {
  "/": [Home, "Official Website"],
  "/courses": [Courses, "Courses"],
  "/faculty": [Faculty, "Faculty"],
  "/about": [About, "About Us"],
  "/admissions": [Admissions, "Admissions 2026"],
  "/verify": [Verify, "Verify Certificate"],
  "/contact": [Contact, "Contact"],
  "/admin": [Admin, "Institute Workspace"],
};
function App() {
  const location = useLocation();
  const root = useRef(null);
  const firstRender = useRef(true);
  const { ready, revision } = useContent();
  useSiteMotion(root, location.pathname + location.search + ready + revision);
  useEffect(() => {
    document.title = `${pages[location.pathname]?.[1] || "Page Not Found"} | R Bukhari Creative Institute`;
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!firstRender.current) root.current.focus({ preventScroll: true });
    firstRender.current = false;
  }, [location.pathname, location.search]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div
        key={location.pathname}
        className="page-transition"
        ref={root}
        id="main-content"
        tabIndex={-1}
      >
        <Routes>
          {Object.entries(pages).map(([path, [Page]]) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
          {["index", "courses", "faculty", "about", "admissions", "verify"].map(
            (name) => (
              <Route
                key={name}
                path={`/${name}.html`}
                element={
                  <Navigate
                    replace
                    to={`${name === "index" ? "/" : "/" + name}${location.search}`}
                  />
                }
              />
            ),
          )}
          <Route
            path="*"
            element={
              <div className="container section-space">
                <h1>Page not found</h1>
                <a href="/" className="btn-dark-pill">
                  Return Home
                </a>
              </div>
            }
          />
        </Routes>
      </div>
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
