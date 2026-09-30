import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components";
import { useContent, api, SocialLinks, SiteFooter } from "../content";

export default function Contact() {
  const { settings } = useContent();
  const [status, setStatus] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true);
    setError("");
    try {
      const result = await api("/inquiries", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          type: "contact",
          consent: data.consent === "on",
        }),
      });
      setStatus(result.id);
      form.reset();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="canvas-wrapper">
        <div className="arvard-canvas page-canvas">
          <Header />
          <div className="page-title-banner">
            <span className="eyebrow-tag">LET’S PLAN YOUR NEXT CHAPTER</span>
            <h1 className="page-main-heading">
              Big questions.
              <br />A real conversation.
            </h1>

          </div>
          <div className="contact-layout">
            <section className="contact-details">
              <div className="contact-intro">
                <span className="section-badge">GET IN TOUCH</span>
                <h2>Find your starting point.</h2>
                <p>
                  Tell us what you want to learn. We’ll help you explore the
                  right program and available batches.
                </p>
              </div>
              <a
                className="contact-method"
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-symbol">
                  <i className="fa-brands fa-whatsapp" />
                </span>
                <span>
                  <small>LET’S TALK</small>
                  <strong>{settings.phone}</strong>
                </span>
              </a>
              <a className="contact-method" href={`mailto:${settings.email}`}>
                <span className="contact-symbol">
                  <i className="fa-regular fa-envelope" />
                </span>
                <span>
                  <small>WRITE TO US</small>
                  <strong>{settings.email}</strong>
                </span>
              </a>
              <div className="contact-method">
                <span className="contact-symbol">
                  <i className="fa-solid fa-location-dot" />
                </span>
                <span>
                  <small>OUR CAMPUS</small>
                  <strong>{settings.address}</strong>
                </span>
              </div>
              <SocialLinks />
              <Link className="link-learn" to="/courses">
                Explore our programs <i className="fa-solid fa-arrow-right" />
              </Link>
            </section>
            <section className="contact-form-card">
              <span className="section-badge">ADMISSIONS DESK</span>
              <h2>Leave us a message.</h2>
              <p className="form-intro">
                Your inquiry goes directly into our admissions inbox.
              </p>
              {status ? (
                <div className="contact-success" role="status">
                  <i className="fa-solid fa-circle-check" />
                  <h3>Message received.</h3>
                  <p>Our admissions team can now review your inquiry.</p>
                  <p className="reference">Reference: {status}</p>
                  <button
                    className="btn-dark-pill"
                    onClick={() => setStatus(null)}
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form className="modern-form" onSubmit={submit}>
                  <div className="form-double-col">
                    <Field
                      label="Full name"
                      name="name"
                      autoComplete="name"
                      minLength={2}
                      maxLength={120}
                      required
                    />
                    <Field
                      label="Phone / WhatsApp"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      minLength={7}
                      maxLength={30}
                      required
                    />
                  </div>
                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                  <div className="input-block">
                    <label htmlFor="contact-message">How can we help?</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      minLength={10}
                      maxLength={3000}
                      required
                    />
                  </div>
                  <div className="bot-field" aria-hidden="true">
                    <label>
                      Leave empty
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <label className="consent-check">
                    <input type="checkbox" name="consent" required />I agree
                    that the institute may store this inquiry and contact me
                    about it.
                  </label>
                  {error && (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <button className="btn-dark-pill full-btn" disabled={busy}>
                    {busy ? "Sending…" : "Send inquiry"}{" "}
                    <i className="fa-solid fa-arrow-right" />
                  </button>

                </form>
              )}
            </section>
          </div>
          <section className="campus-section">
            <div className="flex-between">
              <div>
                <span className="section-badge">LEARN WITH US</span>
                <h2>Meet us in Chichawatni.</h2>
              </div>
              <a
                className="btn-dark-pill"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Google Maps ↗
              </a>
            </div>
            <div className="map-frame">
              <iframe
                title="Institute area map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            {!settings.mapConfirmed && (
              <p className="form-footnote">
                This map shows the Chichawatni area. Contact admissions for the
                exact campus pin.
              </p>
            )}
          </section>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
function Field({ label, name, ...props }) {
  return (
    <div className="input-block">
      <label htmlFor={`contact-${name}`}>{label}</label>
      <input id={`contact-${name}`} name={name} {...props} />
    </div>
  );
}
