# R Bukhari Creative Institute

React + Vite conversion of the original six-page website. Original typography, colors, images, sections, and desktop layout are retained. Responsive overrides and motion are in `src/enhancements.css`; the original design system remains in `style.css`.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL shown by Vite. To build and preview production output:

```sh
npm run build
npm run preview
```

## Structure

- `src/pages/`: Home, Courses, Faculty, About, Admissions, and Verify JSX pages.
- `src/components.jsx`: shared navigation and React state for filters, accessible curriculum dialog, admissions, and certificate requests.
- `src/courses.js`: the original nine course outlines.
- `src/main.jsx`: routes, page titles, and navigation focus.
- `src/useSiteMotion.js` and `src/motion.css`: staggered page and scroll entrances, hover interactions, and ambient animation. Entrance motion uses the browser Web Animations API and cleans up on navigation.
- `public/`: local faculty photos and Netlify routing configuration.

Clean routes (`/courses`, `/admissions`, etc.) and original `.html` URLs are supported. Deploy `dist/` to a static host with SPA fallback to `index.html`. Netlify and Vercel configurations are included; configure the equivalent rewrite on other hosts. This is a root-path deployment.

## Behavior and integration boundaries

Course filters and outlines use React state. Enrollment links preselect the chosen course and mode. The admissions form creates a WhatsApp draft; applicants must send it themselves. No data is stored or submitted to a backend. A fallback link is shown if the browser blocks the popup.

The supplied certificate page returned the same fake student for every ID. The React version retains the page design but clearly offers manual verification until a real certificate API is connected. It never labels an arbitrary ID as authenticated.

Original Google Fonts, Font Awesome CDN, and Unsplash URLs remain external dependencies. Footer social links were placeholders in the supplied site and still need actual institute URLs.

Motion includes staggered slide/blur entrances for headings and cards, a hero image zoom, filtered cards, modal and curriculum entrances, floating metrics and icons, glowing contact button, card lift, image zoom, and button hover/press feedback. Reduced-motion preferences disable animation, including when the preference changes while the page is open.

## Checks

```sh
npm test
```

Playwright uses locally installed Chrome. Tests cover six viewport sizes (320–1920px), all six pages, overflow, JavaScript errors, filters, course modal and enrollment handoff, WhatsApp draft/reset, mobile routing, legacy links, and reduced motion. No real WhatsApp message is sent during testing.
