import { useLayoutEffect } from "react";

// Animate independent content blocks, so a large section never hides its children.
const targets = [
  ".arvard-navbar",
  ".hero-headline-col > *",
  ".hero-stat-circles",
  ".arvard-floating-overlay-card",
  ".section-title-wrap > *",
  ".flex-between > div",
  ".flex-between > a",
  ".page-title-banner > *",
  ".pillar-box",
  ".bento-card",
  ".course-pill-card",
  ".faculty-box",
  ".about-text-column > *",
  ".about-image-card",
  ".admissions-copy > *",
  ".admissions-form-holder",
  ".verify-page-card",
  ".verify-info",
  ".verify-quick-form",
  ".footer-grid > *",
  ".footer-sub-bar",
  ".contact-intro",
  ".contact-method",
  ".contact-form-card",
  ".campus-section",
].join(",");

export function useSiteMotion(root, route) {
  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !window.IntersectionObserver) return;
    const animations = new Set();
    const elements = [...root.current.querySelectorAll(targets)];
    let frame;
    let observer;
    function reveal(element, delay = 0) {
      if (element.classList.contains("is-visible")) return;
      element.classList.add("is-visible");
      const card = element.matches(
        ".bento-card, .course-pill-card, .faculty-box, .admissions-form-holder",
      );
      const animation = element.animate(
        [
          {
            opacity: 0,
            translate: `0 ${card ? 58 : 34}px`,
            scale: card ? ".965" : "1",
            filter: "blur(4px)",
          },
          { opacity: 1, translate: "0 0", scale: "1", filter: "blur(0px)" },
        ],
        {
          duration: card ? 950 : 850,
          delay,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "backwards",
        },
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    }
    elements.forEach((element) => {
      element.classList.add("reveal");
      element.classList.remove("is-visible");
    });
    // A paint boundary makes the opening sequence reliable on cached navigation.
    frame = requestAnimationFrame(() => {
      observer = new IntersectionObserver(
        (entries) => {
          let stagger = 0;
          entries.forEach(({ isIntersecting, target }) => {
            if (!isIntersecting) return;
            reveal(target, Math.min(stagger++ * 110, 440));
            observer.unobserve(target);
          });
        },
        { threshold: 0, rootMargin: "0px 0px -24px 0px" },
      );
      elements.forEach((element) => observer.observe(element));
    });
    function stopMotion() {
      if (!media.matches) return;
      animations.forEach((animation) => animation.cancel());
      elements.forEach((element) => element.classList.add("is-visible"));
      observer?.disconnect();
    }
    media.addEventListener("change", stopMotion);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      elements.forEach((element) =>
        element.classList.remove("reveal", "is-visible"),
      );
      media.removeEventListener("change", stopMotion);
    };
  }, [root, route]);
}
