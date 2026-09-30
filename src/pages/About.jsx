import { Link } from "react-router-dom";
import { Header } from "../components";
import { useContent } from "../content";
export default function About() {
  const { settings } = useContent();
  return (
    <>
      <aside className={"top-bar"}>
        <div className={"container top-bar-content"}>
          <div className={"top-left"}>
            <span>
              <i className={"fa-solid fa-location-dot"}></i>
              {" Chichawatni, District Sahiwal, Punjab"}
            </span>
          </div>
          <div className={"top-right"}>
            <a href={"https://wa.me/923107735336"}>
              <i className={"fa-brands fa-whatsapp"}></i>
              {" 0310 7735336"}
            </a>
          </div>
        </div>
      </aside>
      <div className={"canvas-wrapper"}>
        <div className={"arvard-canvas page-canvas"}>
          <Header />
          <div className={"page-title-banner"}>
            <span className={"eyebrow-tag"}>{"OUR STORY & VALUES"}</span>
            <h1 className={"page-main-heading"}>
              {"Education with edge and heart."}
            </h1>

          </div>

          <div className={"about-content-grid"}>
            <div className={"about-text-column"}>
              <h3>{settings.aboutTitle}</h3>
              <p>{settings.aboutBody}</p>
              <p>
                {
                  "\n            Whether learning in our on-campus computer labs or through our online cohorts, our students graduate with an authentic portfolio, not just a paper.\n          "
                }
              </p>
              <div className={"about-points"}>
                <div className={"point-item"}>
                  <i className={"fa-solid fa-circle-check"}></i>
                  <div>
                    <strong>{"Practical First"}</strong>
                    <p>
                      {
                        "Every lesson leaves you with something tangible to use, share, and build from."
                      }
                    </p>
                  </div>
                </div>
                <div className={"point-item"}>
                  <i className={"fa-solid fa-circle-check"}></i>
                  <div>
                    <strong>{"Creative Discipline"}</strong>
                    <p>
                      {
                        "We merge imagination with systematic workflows, craft, and professional standards."
                      }
                    </p>
                  </div>
                </div>
                <div className={"point-item"}>
                  <i className={"fa-solid fa-circle-check"}></i>
                  <div>
                    <strong>{"Career Momentum"}</strong>
                    <p>
                      {
                        "Our focus is career clarity, client acquisition, and verifiable certificates."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={"about-media-column"}>
              <div className={"about-image-card"}>
                <img
                  src={
                    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={"Students in studio"}
                  decoding={"async"}
                  loading={"lazy"}
                />
              </div>
              <div className={"about-stat-strip"}>
                <div>
                  <strong>{"1,000+"}</strong>
                  <span>{"Students Enrolled"}</span>
                </div>
                <div>
                  <strong>{"24+"}</strong>
                  <span>{"Open Batches"}</span>
                </div>
                <div>
                  <strong>{"94%"}</strong>
                  <span>{"Success Rate"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className={"site-footer"}>
        <div className={"container footer-sub-bar"}>
          <div className={"sub-bar-flex"}>
            <p>{"© 2026 R Bukhari Creative Institute. All rights reserved."}</p>
            <Link className={"link-learn"} to={"/admissions"}>
              {"Join Our Next Batch →"}
            </Link>
          </div>
        </div>
      </footer>
      <a
        href={"https://wa.me/923107735336"}
        className={"whatsapp-fab"}
        target={"_blank"}
        rel={"noopener"}
        aria-label={"Chat on WhatsApp"}
      >
        <i className={"fa-brands fa-whatsapp"}></i>
      </a>
    </>
  );
}
