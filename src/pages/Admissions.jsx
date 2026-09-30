import { Link } from "react-router-dom";
import {
  Header,
  AdmissionProvider,
  AdmissionForm,
  CourseSelect,
  ModeButton,
  AdmissionFeedback,
} from "../components";
export default function Admissions() {
  return (
    <>
      <AdmissionProvider>
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

            <div className={"admissions-page-split"}>
              <div className={"admissions-copy"}>
                <span className={"eyebrow-tag"}>
                  {"FAST-TRACK ENROLLMENT 2026"}
                </span>
                <h1 className={"page-main-heading"}>
                  {"Put your name "}
                  <br />
                  {"on the list."}
                </h1>

                <div className={"admissions-perks"}>
                  <div className={"perk-row"}>
                    <i className={"fa-solid fa-circle-check"}></i>
                    {" Free 1-on-1 counseling with creative mentors"}
                  </div>
                  <div className={"perk-row"}>
                    <i className={"fa-solid fa-circle-check"}></i>
                    {" High-spec lab workstation allocated to each student"}
                  </div>
                  <div className={"perk-row"}>
                    <i className={"fa-solid fa-circle-check"}></i>
                    {" Verified completion certificate upon graduation"}
                  </div>
                </div>
                <div className={"contact-box-callout"}>
                  <div className={"callout-icon"}>
                    <i className={"fa-solid fa-headset"}></i>
                  </div>
                  <div>
                    <strong>{"Questions first?"}</strong>
                    <p>
                      {"Direct Admissions Call / WhatsApp: "}
                      <a href={"tel:03107735336"}>{"0310 7735336"}</a>
                    </p>
                  </div>
                </div>
              </div>
              <div className={"admissions-form-holder"}>
                <div className={"form-pill-container"}>
                  <div className={"form-header-switch"}>
                    <span className={"switch-title"}>{"Application Mode"}</span>
                    <div className={"pill-track-switch"}>
                      <ModeButton
                        type={"button"}
                        className={"mode-btn active"}
                        data-mode={"onsite"}
                      >
                        {"Onsite (Chichawatni)"}
                      </ModeButton>
                      <ModeButton
                        type={"button"}
                        className={"mode-btn"}
                        data-mode={"online"}
                      >
                        {"Online Cohort"}
                      </ModeButton>
                    </div>
                  </div>
                  <AdmissionForm id={"appForm"} className={"modern-form"}>
                    <div className={"form-double-col"}>
                      <div className={"input-block"}>
                        <label htmlFor={"fName"}>{"Full Name *"}</label>
                        <input
                          type={"text"}
                          id={"fName"}
                          name={"fName"}
                          placeholder={"Your full name"}
                          required
                        />
                      </div>
                      <div className={"input-block"}>
                        <label htmlFor={"fPhone"}>{"WhatsApp Number *"}</label>
                        <input
                          type={"tel"}
                          id={"fPhone"}
                          name={"fPhone"}
                          placeholder={"0310 7735336"}
                          required
                        />
                      </div>
                    </div>
                    <div className={"input-block"}>
                      <label htmlFor={"fEmail"}>{"Email Address *"}</label>
                      <input
                        type={"email"}
                        id={"fEmail"}
                        name={"fEmail"}
                        placeholder={"you@example.com"}
                        required
                      />
                    </div>
                    <div className={"form-double-col"}>
                      <div className={"input-block"}>
                        <label htmlFor={"fCourse"}>{"Select Course *"}</label>
                        <CourseSelect id="fCourse" name="fCourse" required />
                      </div>
                      <div className={"input-block"}>
                        <label htmlFor={"fBatch"}>{"Preferred Batch *"}</label>
                        <select
                          id={"fBatch"}
                          name={"fBatch"}
                          required
                          defaultValue={""}
                        >
                          <option value={""} disabled>
                            {"Select Shift..."}
                          </option>
                          <option value={"Morning Batch (9:00 AM - 12:00 PM)"}>
                            {"Morning Batch (9:00 AM - 12:00 PM)"}
                          </option>
                          <option value={"Afternoon Batch (2:00 PM - 5:00 PM)"}>
                            {"Afternoon Batch (2:00 PM - 5:00 PM)"}
                          </option>
                          <option value={"Evening Batch (6:00 PM - 9:00 PM)"}>
                            {"Evening Batch (6:00 PM - 9:00 PM)"}
                          </option>
                          <option value={"Weekend Special (Sat & Sun)"}>
                            {"Weekend Special (Sat & Sun)"}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className={"input-block"}>
                      <label htmlFor={"fGoals"}>{"Your Learning Goals"}</label>
                      <textarea
                        id={"fGoals"}
                        name={"fGoals"}
                        rows={"3"}

                      ></textarea>
                    </div>
                    <button
                      type={"submit"}
                      className={"btn-dark-pill full-btn"}
                    >
                      <span>{"Submit Application"}</span>
                      <i className={"fa-solid fa-paper-plane"}></i>
                    </button>
                  </AdmissionForm>
                  <AdmissionFeedback />
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className={"site-footer"}>
          <div className={"container footer-sub-bar"}>
            <div className={"sub-bar-flex"}>
              <p>
                {"© 2026 R Bukhari Creative Institute. All rights reserved."}
              </p>
              <Link className={"link-learn"} to={"/verify"}>
                {"Verify An Institute Certificate →"}
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
      </AdmissionProvider>
    </>
  );
}
