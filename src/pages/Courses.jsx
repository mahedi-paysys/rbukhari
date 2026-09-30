import { Link } from "react-router-dom";
import {
  Header,
  CourseProvider,
  FilterButton,
  CourseCard,
  SyllabusModal,
  useCourses,
} from "../components";
import { useContent, SiteFooter } from "../content";
export default function Courses() {
  return (
    <CourseProvider>
      <Catalog />
    </CourseProvider>
  );
}
function Catalog() {
  const { courses } = useContent();
  const { openCourse } = useCourses();
  return (
    <>
      <div className="canvas-wrapper">
        <div className="arvard-canvas page-canvas">
          <Header />
          <div className="page-title-banner">
            <span className="eyebrow-tag">SKILLS THAT OPEN DOORS</span>
            <h1 className="page-main-heading">
              Build your creative advantage.
            </h1>

            <div className="filter-pill-container">
              <FilterButton data-filter="all">
                All Programs ({courses.length})
              </FilterButton>
              <FilterButton data-filter="onsite">On-Campus Studio</FilterButton>
              <FilterButton data-filter="online">Online Learning</FilterButton>
            </div>
          </div>
          <div className="course-pill-grid catalog-grid">
            {courses.map((course, i) => (
              <CourseCard
                key={course.id}
                className="course-pill-card"
                data-category={course.mode}
              >
                <div className="pill-card-body">
                  <div className="pill-meta-row">
                    <span
                      className={`mode-chip ${course.mode === "onsite" ? "onsite" : "online"}`}
                    >
                      {course.mode === "both"
                        ? "Online & Onsite"
                        : course.mode === "onsite"
                          ? "Onsite Studio"
                          : "Online Track"}
                    </span>
                    <span className="time-chip">
                      <i className="fa-regular fa-clock" /> {course.duration}
                    </span>
                  </div>
                  <h2 className="pill-card-title">{course.name}</h2>
                  <p className="pill-card-summary">{course.description}</p>
                  <div className="pill-card-actions">
                    <button
                      className="btn-trigger-modal"
                      onClick={() => openCourse(course.name)}
                    >
                      View Outline <i className="fa-solid fa-arrow-right" />
                    </button>
                    <Link
                      to={`/admissions?course=${encodeURIComponent(course.name)}`}
                      className="btn-enroll-chip"
                    >
                      Enroll
                    </Link>
                  </div>
                </div>
                <div
                  className={`pill-card-icon ${["indigo", "cobalt", "amber", "emerald", "slate"][i % 5]}-bubble`}
                >
                  <i className="fa-solid fa-graduation-cap" />
                </div>
              </CourseCard>
            ))}
          </div>
          {courses.length === 0 && (
            <div className="empty-state">
              New programs will be announced soon.{" "}
              <Link to="/contact">Contact admissions</Link> for details.
            </div>
          )}
        </div>
      </div>
      <SyllabusModal />
      <SiteFooter />
    </>
  );
}
