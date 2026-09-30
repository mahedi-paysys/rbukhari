import { Link } from "react-router-dom";
import { useContent } from "./content";
export default function FeaturedCourses() {
  const { courses } = useContent();
  return (
    <div className="course-pill-grid">
      {courses.slice(0, 4).map((course, i) => (
        <article className="course-pill-card" key={course.id}>
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
            <h3 className="pill-card-title">{course.name}</h3>
            <p className="pill-card-summary">{course.description}</p>
            <div className="pill-card-actions">
              <Link className="link-learn" to="/courses">
                View Syllabus →
              </Link>
              <Link
                className="btn-enroll-chip"
                to={`/admissions?course=${encodeURIComponent(course.name)}`}
              >
                Enroll
              </Link>
            </div>
          </div>
          <div
            className={`pill-card-icon ${["indigo", "cobalt", "amber", "emerald"][i]}-bubble`}
          >
            <i className="fa-solid fa-graduation-cap" />
          </div>
        </article>
      ))}
    </div>
  );
}
