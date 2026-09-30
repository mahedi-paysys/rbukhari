import { Link } from "react-router-dom";
import { Header, VerifyCard } from "../components";
export default function Verify() {
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
            <span className={"eyebrow-tag"}>{"CREDENTIAL AUTHENTICATION"}</span>
            <h1 className={"page-main-heading"}>
              {"Verify an official institute certificate."}
            </h1>
            <p className={"page-subheading"}>
              {
                "Enter any student Roll Number or Certificate ID issued by R Bukhari Creative Institute to verify validity."
              }
            </p>
          </div>
          <VerifyCard />
        </div>
      </div>
      <footer className={"site-footer"}>
        <div className={"container footer-sub-bar"}>
          <div className={"sub-bar-flex"}>
            <p>{"© 2026 R Bukhari Creative Institute. All rights reserved."}</p>
            <Link className={"link-learn"} to={"/courses"}>
              {"Browse Available Diplomas →"}
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
