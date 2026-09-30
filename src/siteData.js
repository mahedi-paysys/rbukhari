import { courseDatabase } from "./courses.js";

const outcomes = [
  [
    "Create a coordinated logo and brand identity.",
    "Prepare print-ready and digital marketing artwork.",
    "Present a portfolio of design projects.",
  ],
  [
    "Plan a campaign around audience and business goals.",
    "Build and review Meta advertising campaigns.",
    "Prepare a client proposal and campaign report.",
  ],
  [
    "Plan a channel, research topics, and structure scripts.",
    "Edit a video with a thumbnail and publishing assets.",
    "Review channel analytics and improve discoverability.",
  ],
  [
    "Build spreadsheets using formulas and pivot tables.",
    "Create professional documents and presentations.",
    "Use practical office communication workflows.",
  ],
  [
    "Build and customize a Shopify storefront.",
    "Organize products and configure a checkout workflow.",
    "Plan product promotion and measure store performance.",
  ],
  [
    "Set up Meta campaigns and audience tests.",
    "Evaluate campaign costs and conversion performance.",
    "Develop a campaign optimization plan.",
  ],
  [
    "Research keywords and structure search campaigns.",
    "Create search ads and plan conversion tracking.",
    "Review campaign reports and optimize targeting.",
  ],
  [
    "Use everyday computer, file, and cloud-storage tools.",
    "Practice safe browsing and common troubleshooting.",
    "Build confidence with productivity applications.",
  ],
  [
    "Create mobile-first posters and thumbnails.",
    "Edit short social videos on a smartphone.",
    "Prepare and present a small creative portfolio.",
  ],
];

export const initialContent = {
  settings: {
    announcement: "Admissions Open",
    heroTitle: "Inspiring Minds at R Bukhari Institute",
    heroIntro:
      "Equipping professional creatives in Chichawatni and across Pakistan with Graphic Design, Digital Marketing, and Studio Production mastery.",
    mission:
      "Committed to inspiring creative minds and igniting career growth through practical, digital education.",
    aboutTitle: "Empowering Talent on Their Own Terms",
    aboutBody:
      "R Bukhari Creative Institute was established in Chichawatni to bridge the gap between academic theory and high-demand skills. We believe education works best when every course gives students clear foundations and the confidence to create client-ready work.",
    address: "Chichawatni, District Sahiwal, Punjab",
    email: "rbukharicreative@gmail.com",
    phone: "0310 7735336",
    whatsapp: "923107735336",
    mapQuery: "Chichawatni, District Sahiwal, Punjab, Pakistan",
    mapConfirmed: false,
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
  courses: Object.entries(courseDatabase).map(([name, data], i) => ({
    id: `course-${i + 1}`,
    name,
    description: data.desc,
    duration: data.tag.split("•")[1].trim(),
    mode: i === 7 ? "both" : i < 4 ? "onsite" : "online",
    modules: data.modules,
    outcomes: outcomes[i],
    requirements: [
      i === 8
        ? "Recommended preparation: an Android phone or iPhone with room for design apps."
        : i === 7
          ? "Recommended preparation: no previous computer experience is needed to discuss this foundation track."
          : "Recommended preparation: familiarity with basic computer or smartphone use.",
      i < 4
        ? "Discuss campus attendance and the available batch with admissions."
        : "Discuss device/software access and a reliable internet connection with admissions.",
      "Confirm eligibility, fees, required documents, and batch availability with admissions before enrolling.",
    ],
    published: true,
  })),
  faculty: [
    {
      id: "director",
      name: "Syed Mazhar Abbas Bukhari",
      role: "INSTITUTE DIRECTOR",
      badge: "Executive",
      image: "/Mazhar Abbas.png",
      bio: "Visionary leader steering modern technological education, IT diploma programs, and student empowerment in Chichawatni, District Sahiwal.",
      tags: ["Director", "IT Direction", "Leadership"],
      published: true,
    },
    {
      id: "principal",
      name: "Syeda Rubab Bukhari",
      role: "INSTITUTE PRINCIPAL",
      badge: "Academic",
      image: "/Rubab Bukhari.png",
      bio: "Principal and academic head dedicated to fostering creative discipline, imaginative confidence, and technical mastery across all student cohorts.",
      tags: ["Principal", "Academic Head", "Creative Direction"],
      published: true,
    },
    {
      id: "instructor",
      name: "Habib Ullah",
      role: "BS CYBERSECURITY | IIUI INSTRUCTOR",
      badge: "Cybersecurity",
      image: "/habib.png",
      bio: "Cybersecurity analyst from IIUI specializing in practical defense systems, network security, threat assessment, and ethical hacking fundamentals.",
      tags: ["BS Cybersecurity", "Ethical Hacking", "Network Defense"],
      published: true,
    },
  ],
};
