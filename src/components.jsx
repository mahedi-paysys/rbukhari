import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useContent, api } from "./content";

export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef(null);
  useEffect(() => {
    function close(e) {
      if (e.type === "keydown" && e.key === "Escape") {
        setOpen(false);
        header.current.querySelector("button").focus();
      }
      if (e.type === "pointerdown" && !header.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);
  return (
    <header className="arvard-navbar" ref={header}>
      <Link to="/" className="brand-pill">
        <div className="brand-glyph">RB</div>
        <div className="brand-copy">
          <span className="brand-main">R Bukhari</span>
          <span className="brand-sub">Creative Institute</span>
        </div>
      </Link>
      <nav
        aria-label="Main navigation"
        id="navMenu"
        className={`nav-center-pill ${open ? "show" : ""}`}
      >
        {Object.entries({
          "/": "Home",
          "/courses": "Courses",
          "/faculty": "Faculty",
          "/about": "About Us",
          "/verify": "Verify Certificate",
          "/contact": "Contact",
        }).map(([to, label]) => (
          <NavLink
            end
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `nav-pill-item ${isActive ? "active" : ""}`
            }
          >
            {label}
          </NavLink>
        ))}
        <Link className="nav-pill-item mobile-apply" to="/admissions">
          Apply Now
        </Link>
      </nav>
      <div className="nav-right-actions">
        <NavLink to="/admissions" className="btn-arvard-cta">
          Apply Now <i className="fa-solid fa-arrow-up-right-from-square" />
        </NavLink>
        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="navMenu"
          onClick={() => setOpen(!open)}
        >
          <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </div>
    </header>
  );
}

const CourseContext = createContext(null);
export const useCourses = () => useContext(CourseContext);
export function CourseProvider({ children }) {
  const [filter, setFilter] = useState("all");
  const [course, openCourse] = useState(null);
  return (
    <CourseContext.Provider value={{ filter, setFilter, course, openCourse }}>
      {children}
    </CourseContext.Provider>
  );
}
export function FilterButton({ children, className, ...props }) {
  const { filter, setFilter } = useCourses();
  const value = props["data-filter"];
  return (
    <button
      {...props}
      className={`filter-btn ${filter === value ? "active" : ""}`}
      aria-pressed={filter === value}
      onClick={() => setFilter(value)}
    >
      {children}
    </button>
  );
}
export function CourseCard({ children, ...props }) {
  const { filter } = useCourses();
  if (
    filter !== "all" &&
    props["data-category"] !== "both" &&
    filter !== props["data-category"]
  )
    return null;
  return (
    <div {...props} key={filter}>
      {children}
    </div>
  );
}
export function SyllabusModal() {
  const { course, openCourse } = useCourses();
  const { courses } = useContent();
  const dialog = useRef(null);
  useEffect(() => {
    if (!course) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.querySelector("button").focus();
    function handleKey(e) {
      if (e.key === "Escape") openCourse(null);
      if (e.key === "Tab") {
        const elements = dialog.current.querySelectorAll("button, a[href]");
        const first = elements[0],
          last = elements[elements.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [course, openCourse]);
  if (!course) return null;
  const data = courses.find((item) => item.name === course);
  if (!data) return null;
  return (
    <div
      className="modal-overlay active"
      onClick={(e) => {
        if (e.target === e.currentTarget) openCourse(null);
      }}
    >
      <div
        className="modal-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mTitle"
        aria-describedby="mDesc"
        ref={dialog}
      >
        <button
          className="modal-close-btn"
          aria-label="Close course outline"
          onClick={() => openCourse(null)}
        >
          ×
        </button>
        <div className="modal-badge-row">
          <span className="mode-chip onsite">
            {data.mode} • {data.duration}
          </span>
        </div>
        <h3 className="modal-heading" id="mTitle">
          {course}
        </h3>
        <p className="modal-desc" id="mDesc">
          {data.description}
        </p>
        <div className="modal-curriculum-box">
          <h4>Key Practical Modules:</h4>
          <ul>
            {data.modules.map((module) => (
              <li key={module}>
                <i className="fa-solid fa-circle-check" /> {module}
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-curriculum-box">
          <h4>Learning outcomes</h4>
          <ul>
            {data.outcomes.map((item) => (
              <li key={item}>
                <i className="fa-solid fa-circle-check" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-curriculum-box">
          <h4>Enrollment & preparation</h4>
          <ul>
            {data.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="modal-actions-row">
          <Link
            to={`/admissions?course=${encodeURIComponent(course)}`}
            className="btn-dark-pill full-width-btn"
          >
            Proceed to Registration <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  );
}

const AdmissionContext = createContext(null);
export function AdmissionProvider({ children }) {
  const { courses } = useContent();
  const [params] = useSearchParams();
  const requested = params.get("course");
  const initialCourse = courses.some((item) => item.name === requested)
    ? requested
    : "";
  const [course, setCourse] = useState(initialCourse);
  const [mode, setMode] = useState(
    initialCourse && !initialCourse.includes("Onsite") ? "online" : "onsite",
  );
  const [url, setUrl] = useState("");
  const [reference, setReference] = useState("");
  return (
    <AdmissionContext.Provider
      value={{
        course,
        setCourse,
        mode,
        setMode,
        url,
        setUrl,
        reference,
        setReference,
      }}
    >
      {children}
    </AdmissionContext.Provider>
  );
}
export function ModeButton({ children, className, ...props }) {
  const { courses } = useContent();
  const { mode, setMode, setCourse } = useContext(AdmissionContext);
  const value = props["data-mode"];
  return (
    <button
      {...props}
      aria-pressed={mode === value}
      className={`mode-btn ${mode === value ? "active" : ""}`}
      onClick={() => {
        setMode(value);
        setCourse(
          courses.find((item) => item.mode === value || item.mode === "both")
            ?.name || "",
        );
      }}
    >
      {children}
    </button>
  );
}
export function CourseSelect({ children, ...props }) {
  const { courses } = useContent();
  const { course, setCourse, setMode } = useContext(AdmissionContext);
  return (
    <select
      {...props}
      value={course}
      onChange={(e) => {
        setCourse(e.target.value);
        const item = courses.find((item) => item.name === e.target.value);
        setMode(item?.mode === "onsite" ? "onsite" : "online");
      }}
    >
      <option value="" disabled>
        Choose a Program...
      </option>
      {courses.map((item) => (
        <option key={item.id} value={item.name}>
          {item.name} ({item.duration})
        </option>
      ))}
    </select>
  );
}
export function AdmissionForm({ children, ...props }) {
  const { url, setUrl, mode, setReference } = useContext(AdmissionContext);
  const { settings } = useContent();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  if (url) return null;
  async function submit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message =
      "*New Admission Application - R Bukhari Institute*\n\n" +
      [
        ["Applicant", "fName"],
        ["Phone", "fPhone"],
        ["Email", "fEmail"],
        ["Program", "fCourse"],
        ["Shift", "fBatch"],
        ["Goals", "fGoals"],
      ]
        .map(
          ([label, key]) =>
            `*${label}:* ${String(data.get(key) || "Standard enrollment").trim()}`,
        )
        .join("\n") +
      `\n*Mode:* ${mode}`;
    setBusy(true);
    setError("");
    try {
      const result = await api("/inquiries", {
        method: "POST",
        body: JSON.stringify({
          type: "admission",
          name: data.get("fName"),
          email: data.get("fEmail"),
          phone: data.get("fPhone"),
          course: data.get("fCourse"),
          batch: data.get("fBatch"),
          message: data.get("fGoals"),
          mode,
          consent: data.get("consent") === "on",
          website: data.get("website"),
        }),
      });
      const target = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message + "\n*Reference:* " + result.id)}`;
      setReference(result.id);
      setUrl(target);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form {...props} onSubmit={submit}>
      <fieldset disabled={busy} className="form-fields">
        {children}
      </fieldset>
      <div className="bot-field" aria-hidden="true">
        <label>
          Leave empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent-check">
        <input type="checkbox" name="consent" required />I agree that the
        institute may store my application and contact me about admissions.
      </label>
      {busy && <p role="status">Submitting your application…</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
export function AdmissionFeedback() {
  const { url, setUrl, setCourse, setMode, reference } =
    useContext(AdmissionContext);
  if (!url) return null;
  return (
    <div className="form-feedback-card show" role="status">
      <div className="check-icon">
        <i className="fa-solid fa-circle-check" />
      </div>
      <h3>Application received!</h3>
      <p>
        Your application has been saved for our admissions team. You can also
        send your details on WhatsApp using the button below.
      </p>
      <p className="reference">Reference: {reference}</p>
      <a
        className="btn-dark-pill"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open WhatsApp
      </a>
      <button
        type="button"
        className="btn-dark-pill"
        onClick={() => {
          setUrl("");
          setCourse("");
          setMode("onsite");
        }}
      >
        Submit Another Application
      </button>
    </div>
  );
}
export function QuickVerify({ children, ...props }) {
  const navigate = useNavigate();
  return (
    <form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        navigate(
          "/verify?cert_id=" +
            encodeURIComponent(
              new FormData(e.currentTarget).get("cert_id").trim(),
            ),
        );
      }}
    >
      {children}
    </form>
  );
}
export { default as VerifyCard } from "./CertificateLookup";
