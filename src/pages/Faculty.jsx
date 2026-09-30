import { Header } from "../components";
import { useContent, SiteFooter } from "../content";
export default function Faculty() {
  const { faculty, settings } = useContent();
  return (
    <>
      <div className="canvas-wrapper">
        <div className="arvard-canvas page-canvas">
          <Header />
          <div className="page-title-banner">
            <span className="eyebrow-tag">LEADERSHIP & MENTORSHIP</span>
            <h1 className="page-main-heading">
              People who make learning move.
            </h1>
            <p className="page-subheading">
              Guided by leaders and practitioners who combine student growth,
              creative discipline, and real industry opportunity.
            </p>
          </div>
          <div className="faculty-card-grid">
            {faculty.map((member, i) => (
              <article
                className={`faculty-box ${i === 1 ? "highlight-box" : ""}`}
                key={member.id}
              >
                <div className="faculty-photo-frame">
                  <img
                    src={member.image}
                    alt={member.name}
                    decoding="async"
                    loading="lazy"
                  />
                  <span className="faculty-badge-top">{member.badge}</span>
                </div>
                <div className="faculty-meta">
                  <span className="f-role">{member.role}</span>
                  <h2 className="f-name">{member.name}</h2>
                  <p className="f-bio">{member.bio}</p>
                  <div className="f-chips">
                    {member.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hello, I have a question for ${member.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-full"
                  >
                    <i className="fa-brands fa-whatsapp" /> WhatsApp Contact
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
