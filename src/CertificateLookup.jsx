import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, useContent } from "./content";
export default function CertificateLookup() {
  const [params] = useSearchParams();
  const { settings } = useContent();
  const [id, setId] = useState(params.get("cert_id") || ""),
    [record, setRecord] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function verify(value) {
    setBusy(true);
    setRecord(null);
    setError("");
    try {
      setRecord(await api("/certificates/" + encodeURIComponent(value.trim())));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    const value = params.get("cert_id");
    if (value) {
      setId(value);
      verify(value);
    }
  }, [params]);
  return (
    <div className="verify-page-card">
      <form
        className="verify-search-box"
        onSubmit={(e) => {
          e.preventDefault();
          verify(id);
        }}
      >
        <div className="input-block">
          <label htmlFor="vRoll">Roll Number or Certificate ID</label>
          <input
            id="vRoll"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setError("");
              setRecord(null);
            }}
            required
            minLength={3}
            maxLength={80}
            pattern="[A-Za-z0-9\-]+"
            placeholder="e.g. RB-2026-089"
          />
        </div>
        <button type="submit" className="btn-dark-pill" disabled={busy}>
          {busy ? "Checking…" : "Verify Credential"}{" "}
          <i className="fa-solid fa-shield-halved" />
        </button>
      </form>
      {error && (
        <div className="verification-notice" role="status">
          <h3>We could not verify this credential</h3>
          <p>{error}</p>
          <p>Certificate ID: {id}</p>
          <a
            className="btn-dark-pill"
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Please verify certificate ID: " + id)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact the institute to verify
          </a>
        </div>
      )}
      {record && (
        <div
          className={`verified-result-card show ${record.status === "revoked" ? "certificate-revoked" : ""}`}
          role="status"
        >
          <div className="cert-badge-valid">
            {record.status === "valid"
              ? "Verified certificate"
              : "Revoked certificate"}
          </div>
          <h3>{record.student}</h3>
          <p className="cert-sub">{record.course}</p>
          <div className="cert-meta-grid">
            <div>
              <span className="m-label">Certificate ID</span>
              <strong>{record.id}</strong>
            </div>
            <div>
              <span className="m-label">Issued</span>
              <strong>{record.issued}</strong>
            </div>
            <div>
              <span className="m-label">Status</span>
              <strong>{record.status}</strong>
            </div>
            <div>
              <span className="m-label">Issuer</span>
              <strong>R Bukhari Creative Institute</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
