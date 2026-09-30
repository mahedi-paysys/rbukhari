import { Link } from "react-router-dom";
import { Header, QuickVerify } from "../components";
import { useContent, SocialLinks } from "../content";
import FeaturedCourses from "../FeaturedCourses";
export default function Home() {
  const { settings, courses } = useContent();
  return (
    <>
      <aside className={"top-bar"}>
        <div className={"container top-bar-content"}>
          <div className={"top-left"}>
            <span>
              <i className={"fa-solid fa-location-dot"}></i>
              {settings.address}
            </span>
            <span className={"sep"}>{"•"}</span>
            <a href={`mailto:${settings.email}`}>
              <i className={"fa-solid fa-envelope"}></i>
              {settings.email}
            </a>
          </div>
          <div className={"top-right"}>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target={"_blank"}
              rel={"noopener"}
            >
              <i className={"fa-brands fa-whatsapp"}></i>
              {settings.phone}
            </a>
            <span className={"badge-indigo-soft"}>
              <span className={"pulse-dot"}></span>
              {settings.announcement}
            </span>
          </div>
        </div>
      </aside>

      <div className={"canvas-wrapper"}>
        <div className={"arvard-canvas"}>
          <Header />

          <section className={"arvard-hero-banner"}>
            <div className={"hero-image-wrap"}>
              <img
                src={
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
                }
                alt={"Students collaborating in modern creative lab"}
                decoding={"async"}
                loading="eager"
                fetchPriority="high"
              />
              <div className={"hero-image-shade"}></div>

              <div className={"arvard-floating-overlay-card"}>
                <p className={"overlay-text"}>{settings.mission}</p>
                <Link className={"btn-indigo-pill"} to={"/courses"}>
                  {"Explore Courses "}
                  <i className={"fa-solid fa-arrow-up-right-from-square"}></i>
                </Link>
              </div>
            </div>

            <div className={"arvard-hero-lower"}>
              <div className={"hero-headline-col"}>
                <span className={"eyebrow-tag"}>
                  {"STUDIO & DIGITAL MEDIA EDUCATION"}
                </span>
                <h1 className={"hero-editorial-title"}>{settings.heroTitle}</h1>
                <p className={"hero-editorial-sub"}>{settings.heroIntro}</p>
                <div className={"hero-action-row"}>
                  <Link className={"btn-dark-pill"} to={"/admissions"}>
                    {"Start Your Application"}
                  </Link>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target={"_blank"}
                    rel={"noopener"}
                    className={"btn-whatsapp-pill"}
                  >
                    <i className={"fa-brands fa-whatsapp"}></i>
                    {" Chat on WhatsApp\n              "}
                  </a>
                </div>
              </div>

              <div className={"hero-stat-circles"}>
                <div className={"stat-circle circle-1"}>
                  <span className={"stat-val"}>{"1000+"}</span>
                  <span className={"stat-desc"}>
                    {"Students "}
                    <br />
                    {"Trained"}
                  </span>
                </div>
                <div className={"stat-circle circle-2"}>
                  <span className={"stat-val"}>{"24+"}</span>
                  <span className={"stat-desc"}>
                    {"Studio "}
                    <br />
                    {"Batches"}
                  </span>
                </div>
                <div className={"stat-circle circle-3"}>
                  <span className={"stat-val"}>{"10+"}</span>
                  <span className={"stat-desc"}>
                    {"Diploma "}
                    <br />
                    {"Programs"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className={"pillars-section"}>
        <div className={"container pillars-grid"}>
          <div className={"pillar-box"}>
            <span className={"pillar-idx"}>{"01"}</span>
            <div className={"pillar-icon"}>
              <i className={"fa-solid fa-laptop-code"}></i>
            </div>
            <div className={"pillar-body"}>
              <h4>{"Studio Workstations"}</h4>
              <p>
                {
                  "High-spec hardware configured for creative rendering & design"
                }
              </p>
            </div>
          </div>
          <div className={"pillar-box"}>
            <span className={"pillar-idx"}>{"02"}</span>
            <div className={"pillar-icon"}>
              <i className={"fa-solid fa-chalkboard-user"}></i>
            </div>
            <div className={"pillar-body"}>
              <h4>{"Active Mentors"}</h4>
              <p>{"Supervised by working agency heads and tech analysts"}</p>
            </div>
          </div>
          <div className={"pillar-box"}>
            <span className={"pillar-idx"}>{"03"}</span>
            <div className={"pillar-icon"}>
              <i className={"fa-solid fa-shield-halved"}></i>
            </div>
            <div className={"pillar-body"}>
              <h4>{"Verified Diploma"}</h4>
              <p>{"Verifiable credentials recognized by employers"}</p>
            </div>
          </div>
          <div className={"pillar-box"}>
            <span className={"pillar-idx"}>{"04"}</span>
            <div className={"pillar-icon"}>
              <i className={"fa-solid fa-rocket"}></i>
            </div>
            <div className={"pillar-body"}>
              <h4>{"Freelance Scaling"}</h4>
              <p>
                {
                  "Direct coaching on Upwork, Fiverr, and local client acquisition"
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={"section-space"}>
        <div className={"container"}>
          <div className={"section-title-wrap text-center"}>
            <span className={"section-badge"}>{"THE DIFFERENCE WE MAKE"}</span>
            <h2 className={"section-heading"}>
              {"Where digital skills meet imagination."}
            </h2>
            <p className={"section-subtext"}>
              {
                "Our studio-style education eliminates rote theory in favor of authentic portfolios and career momentum."
              }
            </p>
          </div>
          <div className={"modern-bento-grid"}>
            <div className={"bento-card bento-hero-stat"}>
              <div className={"bento-inner-content"}>
                <span className={"bento-accent-label"}>
                  {"PROVEN OUTCOMES"}
                </span>
                <h3>{"Empowering Chichawatni’s Next Generation"}</h3>
                <p>
                  {
                    "From initial design concepts to executing real digital marketing campaigns, our students learn with confidence and clarity."
                  }
                </p>
                <div className={"bento-metrics-row"}>
                  <div>
                    <strong>{"94%"}</strong>
                    <span>{"Graduation Rate"}</span>
                  </div>
                  <div className={"metric-divider"}></div>
                  <div>
                    <strong>{"100%"}</strong>
                    <span>{"Practical Labs"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={"bento-card bento-visual bento-img-one"}>
              <img
                src={
                  "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
                }
                alt={"Design Lab"}
                decoding={"async"}
                loading={"lazy"}
              />
              <div className={"bento-img-caption"}>
                <span className={"caption-tag"}>{"Design Studio"}</span>
                <h4>{"Modern Creative Workspace"}</h4>
              </div>
            </div>
            <div className={"bento-card bento-quote-box"}>
              <div className={"bento-quote-mark"}>
                <i className={"fa-solid fa-quote-left"}></i>
              </div>
              <p className={"quote-text"}>
                {"Less theory. "}
                <br />
                <em>{"More becoming."}</em>
              </p>
              <span className={"quote-signature"}>
                {"— R Bukhari Leadership Vision"}
              </span>
            </div>
            <div className={"bento-card bento-visual bento-img-two"}>
              <img
                src={
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                }
                alt={"Mentorship"}
                decoding={"async"}
                loading={"lazy"}
              />
              <div className={"bento-img-caption"}>
                <span className={"caption-tag"}>{"Direct Mentorship"}</span>
                <h4>{"Continuous 1-on-1 Feedback"}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={"section-space bg-surface"}>
        <div className={"container"}>
          <div className={"flex-between"}>
            <div>
              <span className={"section-badge"}>{"FEATURED PROGRAMS"}</span>
              <h2 className={"section-heading"}>
                {"Skills for your next chapter."}
              </h2>
            </div>
            <Link className={"btn-dark-pill"} to={"/courses"}>
              {`View All ${courses.length} Programs `}
              <i className={"fa-solid fa-arrow-right"}></i>
            </Link>
          </div>
          <FeaturedCourses />
        </div>
      </section>
      <section className={"verify-strip"}>
        <div className={"container verify-flex"}>
          <div className={"verify-info"}>
            <div className={"verify-icon-wrap"}>
              <i className={"fa-solid fa-stamp"}></i>
            </div>
            <div>
              <h4>{"Verify an R Bukhari Creative Institute Certificate"}</h4>
              <p>
                {
                  "Employers and alumni can authenticate completion credentials online."
                }
              </p>
            </div>
          </div>
          <QuickVerify
            className={"verify-quick-form"}
            action={"verify.html"}
            method={"GET"}
          >
            <input
              type={"text"}
              name={"cert_id"}
              placeholder={"Enter Roll No or Certificate ID"}
              required
            />
            <button type={"submit"} className={"btn-dark-pill"}>
              {"Verify "}
              <i className={"fa-solid fa-arrow-right"}></i>
            </button>
          </QuickVerify>
        </div>
      </section>

      <footer className={"site-footer"}>
        <div className={"container footer-grid"}>
          <div className={"footer-brand"}>
            <div className={"brand-pill in-footer"}>
              <div className={"brand-glyph"}>{"RB"}</div>
              <span className={"brand-name"}>
                {"R Bukhari Creative Institute"}
              </span>
            </div>
            <p className={"footer-desc"}>
              {
                "\n          Modern technological education and creative career development in Chichawatni, District Sahiwal, Punjab.\n        "
              }
            </p>
            <div className={"leadership-tag"}>
              <span>
                <strong>{"Director:"}</strong>
                {" Syed Mazhar Abbas Bukhari"}
              </span>
              <br />
              <span>
                <strong>{"Principal:"}</strong>
                {" Syeda Rubab Bukhari"}
              </span>
            </div>
          </div>
          <div className={"footer-nav-col"}>
            <h5>{"Quick Links"}</h5>
            <ul>
              <li>
                <Link to={"/"}>{"Home"}</Link>
              </li>
              <li>
                <Link to={"/courses"}>{"All Courses"}</Link>
              </li>
              <li>
                <Link to={"/faculty"}>{"Leadership & Mentors"}</Link>
              </li>
              <li>
                <Link to={"/about"}>{"About Institute"}</Link>
              </li>
              <li>
                <Link to={"/admissions"}>{"Admissions 2026"}</Link>
              </li>
              <li>
                <Link to={"/verify"}>{"Verify Certificate"}</Link>
              </li>
            </ul>
          </div>
          <div className={"footer-nav-col"}>
            <h5>{"Popular Tracks"}</h5>
            <ul>
              <li>
                <Link to={"/courses"}>{"Graphic Designing Onsite"}</Link>
              </li>
              <li>
                <Link to={"/courses"}>{"Digital Marketing Mastery"}</Link>
              </li>
              <li>
                <Link to={"/courses"}>{"YouTube Automation"}</Link>
              </li>
              <li>
                <Link to={"/courses"}>{"Shopify E-Commerce"}</Link>
              </li>
              <li>
                <Link to={"/courses"}>{"Office Management Diploma"}</Link>
              </li>
            </ul>
          </div>
          <div className={"footer-nav-col"}>
            <h5>{"Campus & Contact"}</h5>
            <ul className={"footer-contact"}>
              <li>
                <i className={"fa-solid fa-location-dot"}></i>
                {" Chichawatni, District Sahiwal, Punjab"}
              </li>
              <li>
                <i className={"fa-brands fa-whatsapp"}></i>
                <a href={`https://wa.me/${settings.whatsapp}`}>
                  {settings.phone}
                </a>
              </li>
              <li>
                <i className={"fa-solid fa-envelope"}></i>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={"footer-sub-bar"}>
          <div className={"container sub-bar-flex"}>
            <p>{"© 2026 R Bukhari Creative Institute. All rights reserved."}</p>
            <SocialLinks />
          </div>
        </div>
      </footer>

      <a
        href={`https://wa.me/${settings.whatsapp}`}
        className={"whatsapp-fab"}
        target={"_blank"}
        rel={"noopener"}
        aria-label={"Chat on WhatsApp"}
      >
        <i className={"fa-brands fa-whatsapp"}></i>
        <span className={"fab-tooltip"}>{"Chat with Admissions"}</span>
      </a>
    </>
  );
}
