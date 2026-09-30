import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, useContent } from "../content";

const tabs = [
  ["inquiries", "Inbox", "fa-inbox"],
  ["courses", "Programs", "fa-graduation-cap"],
  ["faculty", "Faculty", "fa-users"],
  ["website", "Website", "fa-window-maximize"],
  ["certificates", "Certificates", "fa-certificate"],
];
export default function Admin() {
  const { refresh } = useContent();
  const [session, setSession] = useState(null),
    [checking, setChecking] = useState(true),
    [tab, setTab] = useState("inquiries");
  const [content, setContent] = useState(null),
    [inquiries, setInquiries] = useState([]),
    [certificates, setCertificates] = useState([]);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [dirty, setDirty] = useState(false);
  const [selected, setSelected] = useState(0),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("all");
  useEffect(() => {
    api("/admin/session")
      .then(setSession)
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);
  useEffect(() => {
    if (session) load();
  }, [session]);
  useEffect(() => {
    const handler = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  async function load() {
    setError("");
    try {
      const [data, items, certs] = await Promise.all([
        api("/admin/content"),
        api("/admin/inquiries"),
        api("/admin/certificates"),
      ]);
      setContent(data);
      setInquiries(items);
      setCertificates(certs);
      setDirty(false);
    } catch (e) {
      fail(e);
    }
  }
  function fail(e) {
    setError(e.message);
    if (e.status === 401) setSession(null);
  }
  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      setSession(
        await api("/admin/login", {
          method: "POST",
          body: JSON.stringify(
            Object.fromEntries(new FormData(e.currentTarget)),
          ),
        }),
      );
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }
  async function write(path, method, body) {
    return api(path, {
      method,
      headers: { "X-CSRF-Token": session.csrf },
      body: JSON.stringify(body),
    });
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const clean = structuredClone(content);
      for (const item of clean.courses)
        for (const field of ["modules", "outcomes", "requirements"])
          item[field] = item[field].map((x) => x.trim()).filter(Boolean);
      for (const item of clean.faculty)
        item.tags = item.tags.map((x) => x.trim()).filter(Boolean);
      setContent(await write("/admin/content", "PUT", clean));
      setDirty(false);
      setNotice("Changes saved. Your public website is updated.");
      await refresh();
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }
  const changeSetting = (key, value) => {
    setContent((old) => ({
      ...old,
      settings: { ...old.settings, [key]: value },
    }));
    setDirty(true);
  };
  const changeItem = (group, index, key, value) => {
    setContent((old) => ({
      ...old,
      [group]: old[group].map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
    setDirty(true);
  };
  function add(group) {
    const item =
      group === "courses"
        ? {
            id: crypto.randomUUID(),
            name: "New program",
            description: "",
            duration: "",
            mode: "onsite",
            modules: [""],
            outcomes: [""],
            requirements: [""],
            published: false,
          }
        : {
            id: crypto.randomUUID(),
            name: "New faculty member",
            role: "",
            badge: "Faculty",
            image: "/habib.png",
            bio: "",
            tags: [""],
            published: false,
          };
    setSelected(content[group].length);
    setContent((old) => ({ ...old, [group]: [...old[group], item] }));
    setDirty(true);
  }
  async function logout() {
    if (dirty && !window.confirm("Leave without saving your changes?")) return;
    try {
      await write("/admin/logout", "POST", {});
      setSession(null);
      setContent(null);
      setDirty(false);
      setNotice("");
    } catch (e) {
      fail(e);
    }
  }
  if (checking)
    return (
      <main className="admin-loading" role="status">
        Opening your workspace…
      </main>
    );
  if (!session)
    return (
      <main className="admin-login-layout">
        <section className="admin-login-brand">
          <Link to="/" className="brand-pill">
            <span className="brand-glyph">RB</span>
            <span>R Bukhari Creative Institute</span>
          </Link>
          <span className="eyebrow-tag">INSTITUTE WORKSPACE</span>
          <h1>
            A little organization.
            <br />A lot of possibility.
          </h1>
          <p>
            Manage your programs, support future students, and keep your
            institute’s website up to date.
          </p>
          <div className="admin-login-note">
            <i className="fa-solid fa-shield-halved" /> Private workspace for
            authorized institute staff.
          </div>
        </section>
        <section className="admin-login-card">
          <span className="section-badge">WELCOME BACK</span>
          <h2>Sign in to your workspace.</h2>
          <p>Use your institute administrator credentials.</p>
          <form className="modern-form" onSubmit={login}>
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="btn-dark-pill full-btn" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}{" "}
              <i className="fa-solid fa-arrow-right" />
            </button>
          </form>
          <Link to="/">← Back to the website</Link>
        </section>
      </main>
    );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="brand-pill">
          <span className="brand-glyph">RB</span>
          <span>
            <strong>R Bukhari</strong>
            <small>Institute workspace</small>
          </span>
        </Link>
        <nav aria-label="Admin sections">
          {tabs.map(([key, label, icon]) => (
            <button
              key={key}
              className={tab === key ? "selected" : ""}
              onClick={() => {
                setTab(key);
                setSelected(0);
                setError("");
                setNotice("");
              }}
            >
              <i className={`fa-solid ${icon}`} />
              {label}
              {key === "inquiries" && (
                <span className="count-badge">
                  {inquiries.filter((x) => x.status === "new").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank" rel="noopener noreferrer">
            View website ↗
          </a>
          <span>{session.email}</span>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topline">
          <div>
            <span className="section-badge">YOUR INSTITUTE, AT A GLANCE</span>
            <h1>{tabs.find((x) => x[0] === tab)[1]}</h1>
            <p>
              {tab === "inquiries"
                ? "Turn student questions into their next step."
                : "Keep your institute’s information clear and current."}
            </p>
          </div>
          <button
            className="admin-secondary"
            onClick={() => {
              if (!dirty || window.confirm("Discard unsaved edits and reload?"))
                load();
            }}
          >
            Refresh data
          </button>
        </header>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="admin-notice" role="status">
            {notice}
          </p>
        )}
        {!content ? (
          <p>Loading workspace…</p>
        ) : (
          <>
            {tab === "inquiries" && (
              <>
                <div className="admin-metrics">
                  {[
                    ["Total inquiries", inquiries.length],
                    [
                      "Awaiting reply",
                      inquiries.filter((x) => x.status === "new").length,
                    ],
                    [
                      "Enrolled",
                      inquiries.filter((x) => x.status === "enrolled").length,
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <div className="admin-toolbar">
                  <input
                    aria-label="Search inquiries"
                    placeholder="Search name, email, or course…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <select
                    aria-label="Filter inquiry status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {["all", "new", "contacted", "enrolled", "closed"].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      ),
                    )}
                  </select>
                </div>
                <div className="inquiry-list">
                  {inquiries
                    .filter(
                      (x) =>
                        (status === "all" || x.status === status) &&
                        `${x.name} ${x.email} ${x.course}`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                    )
                    .map((item) => (
                      <Inquiry
                        key={item.id}
                        item={item}
                        save={async (data) => {
                          setError("");
                          try {
                            await write(
                              "/admin/inquiries/" + item.id,
                              "PATCH",
                              data,
                            );
                            setInquiries((old) =>
                              old.map((x) =>
                                x.id === item.id ? { ...x, ...data } : x,
                              ),
                            );
                          } catch (e) {
                            fail(e);
                            throw e;
                          }
                        }}
                      />
                    ))}
                  {!inquiries.length && (
                    <div className="empty-state">
                      <i className="fa-regular fa-envelope" />
                      <h2>A fresh start.</h2>
                      <p>
                        New contact and admission inquiries will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
            {["courses", "faculty", "website"].includes(tab) && (
              <form onSubmit={save} className="admin-content-form">
                <div className="admin-savebar">
                  <span>
                    {dirty ? "You have unsaved changes" : "All changes saved"}
                  </span>
                  <button className="btn-dark-pill" disabled={busy || !dirty}>
                    {busy ? "Saving…" : "Save website changes"}
                  </button>
                </div>
                {tab === "website" ? (
                  <div className="admin-editor">
                    <h2>Homepage & story</h2>
                    {[
                      ["announcement", "Announcement"],
                      ["heroTitle", "Hero headline"],
                      ["heroIntro", "Hero introduction"],
                      ["mission", "Mission"],
                      ["aboutTitle", "About heading"],
                      ["aboutBody", "About story"],
                    ].map(([key, label]) => (
                      <Input
                        key={key}
                        label={label}
                        value={content.settings[key]}
                        onChange={(e) => changeSetting(key, e.target.value)}
                        multiline={[
                          "heroIntro",
                          "mission",
                          "aboutBody",
                        ].includes(key)}
                      />
                    ))}
                    <h2>Contact & map</h2>
                    {[
                      ["address", "Campus address"],
                      ["email", "Contact email"],
                      ["phone", "Display phone"],
                      [
                        "whatsapp",
                        "WhatsApp number (country code, digits only)",
                      ],
                      ["mapQuery", "Google Maps search / exact campus address"],
                    ].map(([key, label]) => (
                      <Input
                        key={key}
                        label={label}
                        value={content.settings[key]}
                        onChange={(e) => changeSetting(key, e.target.value)}
                        required
                      />
                    ))}
                    <label className="consent-check">
                      <input
                        type="checkbox"
                        checked={content.settings.mapConfirmed}
                        onChange={(e) =>
                          changeSetting("mapConfirmed", e.target.checked)
                        }
                      />
                      This is the confirmed campus location.
                    </label>
                    <h2>Official social profiles</h2>
                    <p>
                      Enter real HTTPS profile URLs. Empty profiles stay hidden
                      on the public website.
                    </p>
                    {["facebook", "instagram", "linkedin", "youtube"].map(
                      (key) => (
                        <Input
                          key={key}
                          label={key}
                          type="url"
                          value={content.settings[key]}
                          onChange={(e) => changeSetting(key, e.target.value)}
                        />
                      ),
                    )}
                  </div>
                ) : (
                  <div className="admin-editor-layout">
                    <div className="admin-records">
                      <button
                        type="button"
                        className="admin-secondary"
                        onClick={() => add(tab)}
                      >
                        + Add {tab === "courses" ? "program" : "faculty member"}
                      </button>
                      {content[tab].map((item, i) => (
                        <button
                          type="button"
                          className={i === selected ? "selected" : ""}
                          key={item.id}
                          onClick={() => setSelected(i)}
                        >
                          <strong>{item.name}</strong>
                          <small>
                            {item.published ? "Published" : "Draft / hidden"}
                          </small>
                        </button>
                      ))}
                    </div>
                    <div className="admin-editor">
                      {content[tab][selected] && (
                        <Editor
                          key={content[tab][selected].id}
                          item={content[tab][selected]}
                          type={tab}
                          onChange={(key, value) =>
                            changeItem(tab, selected, key, value)
                          }
                        />
                      )}
                    </div>
                  </div>
                )}
              </form>
            )}
            {tab === "certificates" && (
              <CertificateEditor
                records={certificates}
                save={async (record) => {
                  setError("");
                  await write(
                    "/admin/certificates/" + encodeURIComponent(record.id),
                    "PUT",
                    record,
                  );
                  setCertificates(await api("/admin/certificates"));
                  setNotice("Certificate record saved.");
                }}
                onError={fail}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
function Input({ label, multiline = false, ...props }) {
  const id = props.id || `field-${label.replace(/\W/g, "-")}`;
  return (
    <div className="input-block">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} rows={4} {...props} />
      ) : (
        <input id={id} {...props} />
      )}
    </div>
  );
}
function Editor({ item, type, onChange }) {
  return (
    <>
      <div className="admin-editor-heading">
        <h2>{type === "courses" ? "Program details" : "Faculty profile"}</h2>
        <label className="consent-check">
          <input
            type="checkbox"
            checked={item.published}
            onChange={(e) => onChange("published", e.target.checked)}
          />
          Published
        </label>
      </div>
      <Input
        label="Name"
        value={item.name}
        onChange={(e) => onChange("name", e.target.value)}
        required
      />
      {type === "courses" ? (
        <>
          <div className="form-double-col">
            <Input
              label="Duration"
              value={item.duration}
              onChange={(e) => onChange("duration", e.target.value)}
              required
            />
            <div className="input-block">
              <label htmlFor="course-mode">Learning mode</label>
              <select
                id="course-mode"
                value={item.mode}
                onChange={(e) => onChange("mode", e.target.value)}
              >
                <option value="onsite">Onsite</option>
                <option value="online">Online</option>
                <option value="both">Online & onsite</option>
              </select>
            </div>
          </div>
          <Input
            label="Description"
            value={item.description}
            onChange={(e) => onChange("description", e.target.value)}
            multiline
            required
          />
          {[
            ["modules", "Syllabus modules"],
            ["outcomes", "Learning outcomes"],
            ["requirements", "Enrollment requirements / preparation"],
          ].map(([key, label]) => (
            <Input
              key={key}
              label={`${label} (one per line)`}
              multiline
              value={item[key].join("\n")}
              onChange={(e) => onChange(key, e.target.value.split("\n"))}
              required
            />
          ))}
        </>
      ) : (
        <>
          {[
            ["role", "Role"],
            ["badge", "Badge"],
            ["image", "Photo URL or local path"],
          ].map(([key, label]) => (
            <Input
              key={key}
              label={label}
              value={item[key]}
              onChange={(e) => onChange(key, e.target.value)}
              required
            />
          ))}
          <Input
            label="Biography"
            multiline
            value={item.bio}
            onChange={(e) => onChange("bio", e.target.value)}
            required
          />
          <Input
            label="Specialties (one per line)"
            multiline
            value={item.tags.join("\n")}
            onChange={(e) => onChange("tags", e.target.value.split("\n"))}
            required
          />
        </>
      )}
    </>
  );
}
function Inquiry({ item, save }) {
  const [status, setStatus] = useState(item.status),
    [notes, setNotes] = useState(item.notes),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(false);
  useEffect(() => {
    setStatus(item.status);
    setNotes(item.notes);
  }, [item]);
  return (
    <article className="inquiry-card">
      <div className="inquiry-heading">
        <div>
          <span className="section-badge">{item.type}</span>
          <h2>{item.name}</h2>
          <small>{new Date(item.createdAt).toLocaleString()}</small>
        </div>
        <span className={`status-pill status-${item.status}`}>
          {item.status}
        </span>
      </div>
      <div className="inquiry-contact">
        <a href={`mailto:${item.email}`}>{item.email}</a>
        <a href={`tel:${item.phone}`}>{item.phone}</a>
      </div>
      {item.course && (
        <p>
          <strong>{item.course}</strong> · {item.batch} · {item.mode}
        </p>
      )}
      <p className="inquiry-message">
        {item.message || "No additional message."}
      </p>
      <details>
        <summary>Manage inquiry</summary>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setSaved(false);
            try {
              await save({ status, notes });
              setSaved(true);
            } catch {
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {["new", "contacted", "enrolled", "closed"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Internal notes
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={3000}
            />
          </label>
          <button className="btn-dark-pill" disabled={busy}>
            {busy ? "Saving…" : "Save inquiry"}
          </button>
          {saved && <span role="status"> Saved</span>}
        </form>
      </details>
    </article>
  );
}
function CertificateEditor({ records, save, onError }) {
  const empty = {
    id: "",
    student: "",
    course: "",
    issued: "",
    status: "valid",
    consent: false,
  };
  const [record, setRecord] = useState(empty),
    [busy, setBusy] = useState(false);
  return (
    <div className="admin-editor-layout">
      <div className="admin-records">
        <button className="admin-secondary" onClick={() => setRecord(empty)}>
          + New certificate
        </button>
        {records.map((item) => (
          <button key={item.id} onClick={() => setRecord(item)}>
            <strong>{item.id}</strong>
            <small>
              {item.student} · {item.status}
            </small>
          </button>
        ))}
      </div>
      <form
        className="admin-editor"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await save(record);
          } catch (e) {
            onError(e);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h2>Certificate register</h2>
        <p>
          Only enter genuine issued credentials. Exact certificate IDs can be
          checked on the public verification page.
        </p>
        {[
          ["id", "Certificate ID"],
          ["student", "Student name"],
          ["course", "Completed course"],
          ["issued", "Issue date"],
        ].map(([key, label]) => (
          <Input
            key={key}
            label={label}
            type={key === "issued" ? "date" : "text"}
            value={record[key]}
            onChange={(e) => setRecord({ ...record, [key]: e.target.value })}
            required
          />
        ))}
        <label>
          Status
          <select
            value={record.status}
            onChange={(e) => setRecord({ ...record, status: e.target.value })}
          >
            <option value="valid">Valid</option>
            <option value="revoked">Revoked</option>
          </select>
        </label>
        <label className="consent-check">
          <input
            type="checkbox"
            checked={record.consent}
            onChange={(e) =>
              setRecord({ ...record, consent: e.target.checked })
            }
            required
          />
          The institute is authorized to publish this student’s name and
          credential for verification.
        </label>
        <button className="btn-dark-pill" disabled={busy}>
          {busy ? "Saving…" : "Save certificate"}
        </button>
      </form>
    </div>
  );
}
