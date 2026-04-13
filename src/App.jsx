import { useEffect, useMemo, useRef, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Footer navigation config:
// - Add/edit/remove buttons in columnA.
// - Add matching hover items by id in columnBByItem.
const FOOTER_MENU = {
  title: "Oakley Sun",
  titleId: "oakley-sun",
  columnA: [
    { type: "spacer", key: "sp-0" },
    { type: "button", id: "projects", label: "Projects" },
    { type: "button", id: "experience", label: "Experience" },
    { type: "spacer", key: "sp-1" },
    { type: "spacer", key: "sp-2" },
    { type: "spacer", key: "sp-3" },
    { type: "button", id: "home", label: "Home" },
    { type: "spacer", key: "sp-4" },
  ],
  columnBByItem: {
    projects: ["ChromaFM", "Loop"],
    "oakley-sun": ["About + Contact Me"],
  },
};

const PROJECT_PANELS = {
  chromafm: { label: "ChromaFM" },
  loop: { label: "Loop" },
};

// Experience timeline config:
// - `position` controls branch position along the main timeline (0 to 100).
// - `direction` chooses whether the job card sits above or below the timeline.
// - Optional presets: left=30, midLeft=42, center=50, midRight=62, right=74.
const EXPERIENCE_TIMELINE = {
  title: "Experience",
  items: [
    {
      id: "job-1",
      position: 31,
      direction: "down",
      icon: "/media/experience-icon-turing.jpg",
      company: "Turing",
      role: "AI QA Analyst Intern",
      period: "Aug 2025 - Present",
      location: "Palo Alto, California",
      points: [
        <>
          Engineered <strong>Python-based testing workflows</strong> for large language models,
          generating structured prompt sets and edge-case scenarios that uncovered weaknesses in AI
          reasoning, factual accuracy, and code generation
        </>,
        <>
          Evaluated <strong>3 state-of-the-art LLMs</strong> across 100+{" "}
          <strong>structured prompt-response test cases</strong>, identifying systematic reasoning
          errors and delivering actionable feedback that reduced repeated failure modes by 18%
        </>,
        <>
          Developed benchmarking methodology comparing output quality, determinism, and image recognition
          across models side-by-side, delivering written analysis that gave non-technical stakeholders a
          clear framework
        </>,
      ],
    },
    {
      id: "job-2",
      position: 48,
      direction: "up",
      icon: "/media/experience-icon-gdsc.png",
      company: "UBC Google Student Developer Club",
      role: "Product Developer",
      period: "Sept 2025 - Present",
      location: "Vancouver, Canada",
      hasDetails: false,
      points: [
        "Add your first key responsibility here.",
        "Add measurable impact and outcomes here.",
        "Add stack, tools, and team collaboration details here.",
      ],
    },
  ],
};

const OAKLEY_PROFILE = {
  images: [
    {
      src: "/media/oakley-1.jpg",
      title: "Professional",
      text: "Based in Canada, I am currently pursuing a Bachelor’s degree in Computer Science at the University of British Columbia. I am passionate about building full-stack projects that create real-world impact, combining thoughtful design with scalable engineering. I am actively seeking to further develop my skills in software engineering and machine learning, with a focus on creating data-driven and user-centric solutions.", 
    },
    {
      src: "/media/oakley-2.png",
      title: "Personal",
      text: "Ever since I was young I have been fascinated by coding and technology. My adventure with computer engineering started with Scratch and Minecraft modding, evolving to building computers and websites, finally leading to where I am today. Outside of school and my career, my hobbies include fashion and music, both as a producer and consumer. Currently I am trying to read more and start playing the piano again.",
    },
    {
      src: "/media/oakley-3.png",
      title: "Contact Me",
      text: "",
      socialLinks: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/oakleysun/",
          icon: "/media/icon-linkedin.png",
        },
        {
          label: "GitHub",
          href: "https://github.com/OakleySun",
          icon: "/media/icon-github.png",
        },
        {
          label: "Instagram",
          href: "https://www.instagram.com/oakl.s/",
          icon: "/media/icon-instagram.png",
        },
      ],
    },
  ],
};

const PROJECT_CONTENT = {
  chromafm: {
    title: "CHROMAFM",
    subtitle: "Spotify Wrapped reimagined as a color palette",
    summary: (
      <>
        <strong>
          ChromaFM is a full-stack web application that transforms Spotify listening data into a
          color-based visual profile of a user's music taste. By integrating Spotify OAuth and APIs,
          the app analyzes album artwork to extract dominant colors and organizes a user's top albums
          into distinct color categories using a custom ranking algorithm based on top tracks, saved
          albums, and artist data. It presents results through an interactive grid and allows the user to generate a
          high-quality, shareable image optimized for social media. Built with React and Node.js/Express,
          the system incorporates performance optimizations such as caching and request deduplication to
          ensure fast, reliable user experiences while delivering a unique blend of data visualization and
          design.
        </strong>
      </>
    ),
    summaryDetail: (
      <>
        The inspiration for ChromaFM originated from a viral trend on TikTok, where users shared their
        favorite albums organized by the color of their cover art. After trying it out for myself, I
        found that the process of manually choosing albums and designing the graphics for posting was
        time-consuming and required many hard decisions. That inspired me to build a tool that could
        automatically generate these visuals in a more data-driven and seamless way using real Spotify
        listening data.
      </>
    ),
    infoRow: [
      { label: "Built with", value: "React, JavaScript, Node.js/Express, Spotify API, OAuth" },
      { label: "Finished date", value: "February 2026" },
      {
        label: "Links",
        value: (
          <a
            href="https://github.com/OakleySun/ChromaFM"
            target="_blank"
            rel="noreferrer"
            className="project-inline-link"
          >
            GitHub
          </a>
        ),
      },
    ],
    media: [
      { type: "video", src: "/media/chromafm-prototype.mp4", label: "Video Demo" },
      { type: "image", src: "/media/output.png", label: "Exported Images Examples" },
    ],
  },
  loop: {
    title: "LOOP",
    subtitle: "A science and AI-powered habit builder designed to help habits stick",
    summary: (
      <>
        <strong>
          Loop is a habit-building application designed with scientifically grounded features that go
          beyond simple habit tracking. While most habit apps focus only on logging progress, Loop
          actively supports users in building sustainable habits through behavioral science principles.
          The main feature is the Gemini-powered dynamic goals that adjust daily based on the user's mood, 
          lowering the barrier to action in line with Activation Energy Theory and making it easier to stay consistent. 
          Loop further enhances effectiveness with a feature that recommends the optimal number of days needed for a habit to become automatic, 
          helping users set realistic and personalized timelines with real, science-backed reasons.
          To prevent burnout, users are limited to building three habits at a time, aligning with Cognitive Load
          Theory and the idea that willpower is finite.  Finally, To reinforce accountability, Loop integrates both social and group-based features: 
          users can assign an accountability partner who receives automated SMS updates on their progress, while group habit modes require all members 
          to complete their daily tasks to maintain shared streaks.
        </strong>
      </>
    ),
    summaryDetail: (
      <>
        Built under 24 hours at nwHacks 2026
      </>
    ),
    infoRow: [
      { label: "Built with", value: "React Native, TypeScript, GeminiAPI, Expo Go" },
      { label: "Finished date", value: "January 2026" },
      {
        label: "Links",
        value: (
          <>
            <a
              href="https://github.com/OakleySun/Loop"
              target="_blank"
              rel="noreferrer"
              className="project-inline-link"
            >
              GitHub
            </a>
            {" / "}
            <a
              href="https://devpost.com/software/loop-c6lieh"
              target="_blank"
              rel="noreferrer"
              className="project-inline-link"
            >
              Devpost
            </a>
          </>
        ),
      },
    ],
    media: [
      { type: "video", src: "/media/loop-mobile-demo.webm", label: "Video Demo" },
      { type: "image", src: "/media/loop-moods.png", label: "Mood Variations" },
      { type: "image", src: "/media/loop-pages.png", label: "App Screens" },
    ],
  },
};
const rightColumn = [
  "",
  "",
  "",
];

// Intro animation controls. Edit this block to change copy, placement, size, and pacing.
const INTRO_CONFIG = {
  fontSize: "clamp(11px, 1.05vw, 13px)",
  lineHeight: 1.42,
  tracking: "0.018em",
  lineGapPx: 34,
  containerWidth: "min(94vw, 980px)",
  containerTop: "16.5vh",
  maxVisibleLines: 3,
  wordStaggerMs: 177,
  wordRiseMs: 847,
  lineStartGapMs: 1617,
  lineFadeMs: 1001,
  fadeOutDelayAfterOverflowMs: 501,
  endingHoldMs: 847,
  lines: [
    { text: "We are sun and moon, dear friend;", x: 0, y: 0 },
    { text: "we are sea and land.", x: 0, y: 0 },
    { text: "It is not our purpose to become each other;", x: 0, y: 0 },
    { text: "it is to recognize each other,", x: 0, y: 0 },
    { text: "to learn to see the other and honor them for what they are:", x: 0, y: 0 },
    { text: "each the other's opposite and complement.", x: 0, y: 0 },
    { text: "To hold our tongues when everyone is gossiping,", x: 0, y: 0 },
    { text: "to smile without hostility at people and institutions,", x: 0, y: 0 },
    { text: "to compensate for the shortage of love in the world", x: 0, y: 0 },
    { text: "with more love in small, private matters;", x: 0, y: 0 },
    { text: "to be more faithful in our work,", x: 0, y: 0 },
    { text: "to show greater patience,", x: 0, y: 0 },
    { text: "to forgo the cheap revenge obtainable from mockery and criticism:", x: 0, y: 0 },
    { text: "all these are things we can do.", x: 0, y: 0 },
    { text: "- HERMANN HESSE", x: 0, y: 0 },
    { text: "WELCOME TO OAKLEY SUN'S PORTFOLIO", x: 0, y: 0 },
  ],
};

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function TextColumn({ title, lines, titleDark = false }) {
  return (
    <div className="min-w-0 text-[12px] leading-[1.35] tracking-[0.03em] uppercase text-[#b5b5b5] sm:text-[13px]">
      {title ? (
        <button
          type="button"
          className={`text-link ${titleDark ? "font-medium text-[#161616]" : "font-normal"}`}
        >
          {title}
        </button>
      ) : null}
      {lines.map((line, index) =>
        line === "" ? (
          <div key={`sp-${index}`} className="h-3" />
        ) : (
          <button key={`${line}-${index}`} type="button" className="text-link block text-left">
            {line}
          </button>
        )
      )}
    </div>
  );
}

function Cube({ visible }) {
  return (
    <div
      className={`cube-wrap pointer-events-none absolute left-1/2 top-[37%] grid h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 place-items-center transition-transform duration-[233ms] ease-out md:h-[220px] md:w-[220px] ${
        visible ? "scale-100" : "scale-0"
      }`}
    >
      <div className="cube relative">
        <div className="face front" />
        <div className="face back" />
        <div className="face right" />
        <div className="face left" />
        <div className="face top" />
        <div className="face bottom" />
      </div>
    </div>
  );
}

function ProjectsPanels({ visible, open, highlightedPanel }) {
  const highlightClass =
    highlightedPanel === "chromafm"
      ? "highlight-left"
      : highlightedPanel === "loop"
        ? "highlight-right"
        : "";

  return (
    <div
      className={`cube-wrap pointer-events-none absolute left-1/2 top-[37%] grid h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 place-items-center transition-all duration-500 ease-in-out md:h-[220px] md:w-[220px] ${
        visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
      }`}
    >
      <div className={`unfold-wrap ${open ? "open" : ""} ${highlightClass}`}>
        <div className="unfold-square left">
          <span className="unfold-label">CHROMAFM</span>
        </div>
        <div className="unfold-square right">
          <span className="unfold-label">LOOP</span>
        </div>
      </div>
    </div>
  );
}

function MediaGallery({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFallback, setShowFallback] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [shouldMountVideo, setShouldMountVideo] = useState(true);
  const [lightboxItem, setLightboxItem] = useState(null);
  const swipeStartXRef = useRef(null);

  useEffect(() => {
    setActiveIndex(0);
    setShowFallback(false);
    const startsWithVideo = items?.[0]?.type === "video";
    setVideoLoading(startsWithVideo);
    setShouldMountVideo(!startsWithVideo);
  }, [items]);

  useEffect(() => {
    if (!items?.length) {
      return;
    }

    items.forEach((item) => {
      if (item.type === "image") {
        const img = new Image();
        img.src = item.src;
      }
    });
  }, [items]);

  useEffect(() => {
    const active = items?.[activeIndex];
    if (!active || active.type !== "video") {
      setShouldMountVideo(true);
      setVideoLoading(false);
      return undefined;
    }

    setShouldMountVideo(false);
    const timer = window.setTimeout(() => {
      setShouldMountVideo(true);
      setVideoLoading(true);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [activeIndex, items]);

  useEffect(() => {
    if (!lightboxItem) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxItem(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem]);

  if (!items?.length) {
    return <div className="project-prototype-placeholder">Video placeholder</div>;
  }

  const activeItem = items[activeIndex];
  const goNext = () => {
    setShowFallback(false);
    setActiveIndex((current) => {
      const next = (current + 1) % items.length;
      setVideoLoading(items[next]?.type === "video");
      return next;
    });
  };
  const goPrev = () => {
    setShowFallback(false);
    setActiveIndex((current) => {
      const next = (current - 1 + items.length) % items.length;
      setVideoLoading(items[next]?.type === "video");
      return next;
    });
  };
  const handlePointerDown = (event) => {
    swipeStartXRef.current = event.clientX;
  };
  const handlePointerUp = (event) => {
    if (swipeStartXRef.current === null) {
      return;
    }
    const deltaX = event.clientX - swipeStartXRef.current;
    swipeStartXRef.current = null;
    if (Math.abs(deltaX) < 40) {
      return;
    }
    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  return (
    <div className="project-gallery">
      <p className="project-prototype-label">{activeItem.label}</p>
      <div
        className="project-prototype-frame"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {activeItem.type === "video" ? (
          <>
            {shouldMountVideo ? (
              <video
                key={activeItem.src}
                className="project-prototype-video"
                src={activeItem.src}
                controls
                preload="metadata"
                playsInline
                onLoadedData={() => setVideoLoading(false)}
                onWaiting={() => setVideoLoading(true)}
                onPlaying={() => setVideoLoading(false)}
              />
            ) : null}
            {videoLoading || !shouldMountVideo ? (
              <div className="project-video-loading">Loading video...</div>
            ) : null}
          </>
        ) : showFallback ? (
          <div className="project-prototype-placeholder">{activeItem.label}</div>
        ) : (
          <button
            type="button"
            className="project-prototype-image-btn"
            onClick={() => setLightboxItem(activeItem)}
            aria-label={`Expand ${activeItem.label}`}
          >
            <img
              key={activeItem.src}
              className="project-prototype-image"
              src={activeItem.src}
              alt={activeItem.label}
              onError={() => setShowFallback(true)}
            />
          </button>
        )}
      </div>

      <div className="project-gallery-controls">
        <button type="button" className="project-gallery-btn" onClick={goPrev}>
          Prev
        </button>
        <p className="project-gallery-count">
          {activeIndex + 1} / {items.length}
        </p>
        <button type="button" className="project-gallery-btn" onClick={goNext}>
          Next
        </button>
      </div>

      {lightboxItem ? (
        <div className="project-media-lightbox" onClick={() => setLightboxItem(null)}>
          <button
            type="button"
            className="project-media-lightbox-close"
            onClick={() => setLightboxItem(null)}
          >
            Close
          </button>
          <img
            className="project-media-lightbox-image"
            src={lightboxItem.src}
            alt={lightboxItem.label}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}

function ProjectContent({ projectId }) {
  if (!projectId) {
    return null;
  }

  const project = PROJECT_CONTENT[projectId];

  return (
    <section className="project-content-area">
      <header className="project-content-header">
        <h2 className="project-content-title">{project.title}</h2>
        <p className="project-content-subtitle">{project.subtitle}</p>
      </header>

      <div className="project-content-grid">
        <article className="project-content-meta">
          <p className="project-content-summary">{project.summary}</p>
          <p className="project-content-summary">
            {project.summaryDetail}
          </p>
          <section className="project-info-row">
            {project.infoRow.map((item) => (
              <div key={item.label} className="project-info-cell">
                <p className="project-info-label">{item.label}</p>
                <p className="project-info-value">{item.value}</p>
              </div>
            ))}
          </section>
        </article>

        <section className="project-content-prototype">
          <MediaGallery items={project.media} />
        </section>
      </div>
    </section>
  );
}

function OakleyContent() {
  return (
    <section className="oakley-content-area">
      <div className="oakley-gallery">
        {OAKLEY_PROFILE.images.map((image) => (
          <figure key={image.src} className="oakley-card">
            <img className="oakley-image" src={image.src} alt={image.title} />
            <figcaption className="oakley-copy">
              <h3 className="oakley-title">{image.title}</h3>
              <p className="oakley-text">{image.text}</p>
              {image.socialLinks ? (
                <div className="oakley-socials" aria-label="Social links">
                  {image.socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="oakley-social-link"
                    >
                      <img src={link.icon} alt={link.label} className="oakley-social-icon" />
                    </a>
                  ))}
                </div>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ExperienceContent() {
  const [overlayItemId, setOverlayItemId] = useState(null);
  const [isOverlayClosing, setIsOverlayClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const expandedItem = EXPERIENCE_TIMELINE.items.find((item) => item.id === overlayItemId) ?? null;

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    []
  );

  const openOverlay = (itemId) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOverlayClosing(false);
    setOverlayItemId(itemId);
  };

  const closeOverlay = () => {
    if (!overlayItemId || isOverlayClosing) {
      return;
    }

    setIsOverlayClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setOverlayItemId(null);
      setIsOverlayClosing(false);
      closeTimerRef.current = null;
    }, 220);
  };
  const resolveTimelinePosition = (item) => {
    if (typeof item.position === "number") {
      return `${clamp(item.position, 0, 100)}%`;
    }
    if (typeof item.x === "number") {
      return `${clamp(item.x * 100, 0, 100)}%`;
    }
    return "50%";
  };

  return (
    <section className="experience-content-area">
      <h2 className="experience-title">{EXPERIENCE_TIMELINE.title}</h2>
      <div className="experience-timeline">
        <div className="experience-main-line" />
        {EXPERIENCE_TIMELINE.items.map((item, index) => (
          <article
            key={item.id}
            className={`experience-item ${item.direction === "up" ? "up" : "down"}`}
            style={{ "--item-x": resolveTimelinePosition(item), "--item-delay": `${0.42 + index * 0.18}s` }}
          >
            <div className="experience-branch-line" />
            <div className="experience-card">
              <div className="experience-card-inner">
                {item.icon ? (
                  <div className="experience-card-icon-wrap">
                    <img src={item.icon} alt={`${item.company} icon`} className="experience-card-icon" />
                  </div>
                ) : null}
                <div className="experience-card-content">
                  <p className="experience-card-company">{item.company}</p>
                  <p className="experience-card-role">{item.role}</p>
                  <p className="experience-card-period">{item.period}</p>
                  <p className="experience-card-location">{item.location}</p>
                  {item.hasDetails !== false ? (
                    <button
                      type="button"
                      className="experience-card-toggle"
                      onClick={() => openOverlay(item.id)}
                    >
                      Click to learn more
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      {expandedItem ? (
        <div
          className={`experience-overlay ${isOverlayClosing ? "closing" : ""}`}
          onClick={closeOverlay}
        >
          <article className="experience-overlay-card" onClick={(event) => event.stopPropagation()}>
            <p className="experience-card-company">{expandedItem.company}</p>
            <p className="experience-card-role">{expandedItem.role}</p>
            <p className="experience-card-period">{expandedItem.period}</p>
            <p className="experience-card-location">{expandedItem.location}</p>
            <ul className="experience-card-points">
              {expandedItem.points.map((point, index) => (
                <li key={`${expandedItem.id}-overlay-point-${index}`}>{point}</li>
              ))}
            </ul>
            <button
              type="button"
              className="experience-card-toggle experience-close-btn"
              onClick={closeOverlay}
            >
              Close
            </button>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activeColumnAItem, setActiveColumnAItem] = useState(null);
  const [columnBTop, setColumnBTop] = useState(0);
  const [activeColumnBItem, setActiveColumnBItem] = useState(null);
  const [isCubeVisible, setIsCubeVisible] = useState(true);
  const [activeProjectScreen, setActiveProjectScreen] = useState(null);
  const [isNavPanelOpen, setIsNavPanelOpen] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth
  );
  const closeMenuTimerRef = useRef(null);
  const navigateCloseTimerRef = useRef(null);
  const homeReopenNavRafRef = useRef(null);
  const footerPanelRef = useRef(null);

  useEffect(() => {
    const preloadVideo = document.createElement("video");
    preloadVideo.preload = "metadata";
    preloadVideo.src = "/media/chromafm-prototype.mp4";
    preloadVideo.load();
  }, []);

  const lineTimings = useMemo(() => {
    const lines = INTRO_CONFIG.lines.map((line, index) => {
      const words = line.text.split(" ");
      const start = index * INTRO_CONFIG.lineStartGapMs;
      const revealEnd = start + (words.length - 1) * INTRO_CONFIG.wordStaggerMs + INTRO_CONFIG.wordRiseMs;

      let fadeStart = revealEnd + INTRO_CONFIG.fadeOutDelayAfterOverflowMs;
      if (index + INTRO_CONFIG.maxVisibleLines < INTRO_CONFIG.lines.length) {
        const overflowStart = (index + INTRO_CONFIG.maxVisibleLines) * INTRO_CONFIG.lineStartGapMs;
        fadeStart = Math.max(fadeStart, overflowStart + INTRO_CONFIG.fadeOutDelayAfterOverflowMs);
      }

      const end = fadeStart + INTRO_CONFIG.lineFadeMs;
      return { ...line, index, words, start, fadeStart, end };
    });

    const totalDuration = lines[lines.length - 1].end + INTRO_CONFIG.endingHoldMs;
    return { lines, totalDuration };
  }, []);

  useEffect(() => {
    if (!showIntro) {
      return undefined;
    }

    let frameId = 0;
    let startAt = 0;

    const tick = (now) => {
      if (!startAt) {
        startAt = now;
      }

      const elapsed = now - startAt;
      setElapsedMs(elapsed);

      if (elapsed >= lineTimings.totalDuration) {
        setShowIntro(false);
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [lineTimings.totalDuration, showIntro]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(
    () => () => {
      if (closeMenuTimerRef.current) {
        window.clearTimeout(closeMenuTimerRef.current);
      }
      if (navigateCloseTimerRef.current) {
        window.clearTimeout(navigateCloseTimerRef.current);
      }
      if (homeReopenNavRafRef.current) {
        window.cancelAnimationFrame(homeReopenNavRafRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (activeProjectScreen) {
      return undefined;
    }

    const handleMouseMove = (event) => {
      const threshold = window.innerHeight * (2 / 3);
      setIsCubeVisible(event.clientY >= threshold);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeProjectScreen]);

  const skipIntro = () => setShowIntro(false);
  const introScale = clamp(viewportWidth / 980, 0.54, 1);
  const activeColumnBLines = FOOTER_MENU.columnBByItem[activeColumnAItem] ?? [];
  const isProjectsActive = activeColumnAItem === "projects";
  const hasActiveProjectScreen = Boolean(activeProjectScreen);
  const isNavigateToggleMode =
    activeProjectScreen === "oakley" ||
    activeProjectScreen === "experience" ||
    activeProjectScreen === "chromafm" ||
    activeProjectScreen === "loop";
  const isMobileViewport = viewportWidth <= 980;

  useEffect(() => {
    if (isNavigateToggleMode) {
      setIsNavPanelOpen(false);
      return;
    }
    setIsNavPanelOpen(true);
  }, [isNavigateToggleMode]);

  useEffect(() => {
    if (!(isNavigateToggleMode && isNavPanelOpen)) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (footerPanelRef.current && !footerPanelRef.current.contains(event.target)) {
        setIsNavPanelOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isNavigateToggleMode, isNavPanelOpen]);
  const activateColumnItem = (id, event) => {
    if (closeMenuTimerRef.current) {
      window.clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
    if (navigateCloseTimerRef.current) {
      window.clearTimeout(navigateCloseTimerRef.current);
      navigateCloseTimerRef.current = null;
    }
    setActiveColumnAItem(id);
    setActiveColumnBItem(null);
    setColumnBTop(event.currentTarget.offsetTop);
  };
  const queueCloseMenu = () => {
    if (activeProjectScreen) {
      return;
    }

    if (closeMenuTimerRef.current) {
      window.clearTimeout(closeMenuTimerRef.current);
    }
    closeMenuTimerRef.current = window.setTimeout(() => {
      setActiveColumnAItem(null);
      setActiveColumnBItem(null);
      closeMenuTimerRef.current = null;
    }, 260);
  };
  const cancelCloseMenu = () => {
    if (closeMenuTimerRef.current) {
      window.clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
  };
  const queueNavigatePanelClose = () => {
    if (!isNavigateToggleMode || isMobileViewport) {
      return;
    }
    if (navigateCloseTimerRef.current) {
      window.clearTimeout(navigateCloseTimerRef.current);
    }
    navigateCloseTimerRef.current = window.setTimeout(() => {
      setIsNavPanelOpen(false);
      navigateCloseTimerRef.current = null;
    }, 700);
  };
  const cancelNavigatePanelClose = () => {
    if (isMobileViewport) {
      return;
    }
    if (navigateCloseTimerRef.current) {
      window.clearTimeout(navigateCloseTimerRef.current);
      navigateCloseTimerRef.current = null;
    }
  };
  const handleColumnAClick = (id, event) => {
    if (id === "home") {
      if (closeMenuTimerRef.current) {
        window.clearTimeout(closeMenuTimerRef.current);
        closeMenuTimerRef.current = null;
      }
      if (navigateCloseTimerRef.current) {
        window.clearTimeout(navigateCloseTimerRef.current);
        navigateCloseTimerRef.current = null;
      }
      if (homeReopenNavRafRef.current) {
        window.cancelAnimationFrame(homeReopenNavRafRef.current);
        homeReopenNavRafRef.current = null;
      }
      setIsNavPanelOpen(false);
      setActiveProjectScreen(null);
      setActiveColumnAItem(null);
      setActiveColumnBItem(null);
      setColumnBTop(0);
      homeReopenNavRafRef.current = window.requestAnimationFrame(() => {
        setIsNavPanelOpen(true);
        homeReopenNavRafRef.current = null;
      });
      return;
    }

    const hasSecondaryColumn = (FOOTER_MENU.columnBByItem[id] ?? []).length > 0;
    if (hasSecondaryColumn) {
      setActiveColumnAItem(id);
      if (event?.currentTarget) {
        setColumnBTop(event.currentTarget.offsetTop);
      }
      return;
    }

    if (id === FOOTER_MENU.titleId) {
      return;
    }

    if (id === "experience") {
      setActiveProjectScreen("experience");
      return;
    }

    if (id !== "projects") {
      setActiveProjectScreen(null);
    }
  };
  const handleColumnBClick = (line) => {
    const normalized = line.toLowerCase();

    if (normalized === "about + contact me") {
      setActiveProjectScreen("oakley");
      setActiveColumnAItem(FOOTER_MENU.titleId);
      return;
    }

    if (!isProjectsActive) {
      return;
    }

    if (normalized === "chromafm" || normalized === "loop") {
      setActiveProjectScreen(normalized);
      setActiveColumnAItem("projects");
    }
  };
  const handleColumnBHighlight = (line) => {
    const normalized = line.toLowerCase();
    if (normalized === "chromafm" || normalized === "loop") {
      setActiveColumnBItem(normalized);
      return;
    }
    setActiveColumnBItem(null);
  };

  return (
    <main className="site-main relative min-h-screen overflow-hidden bg-[#e5e5e5] font-['Montserrat',Arial,sans-serif]">
      <section
        className={`transition-opacity duration-700 ${
          showIntro ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Cube visible={isCubeVisible && !isProjectsActive && !hasActiveProjectScreen} />
        <ProjectsPanels
          visible={isCubeVisible && !hasActiveProjectScreen}
          open={isProjectsActive}
          highlightedPanel={activeColumnBItem}
        />
        {activeProjectScreen === "oakley" ? (
          <OakleyContent />
        ) : activeProjectScreen === "experience" ? (
          <ExperienceContent />
        ) : (
          <ProjectContent key={activeProjectScreen ?? "none"} projectId={activeProjectScreen} />
        )}

        <footer
          className={`site-footer absolute inset-x-0 bottom-1 px-6 sm:bottom-5 sm:px-[6vw] ${
            isNavigateToggleMode ? "navigate-mode" : ""
          }`}
        >
          {isNavigateToggleMode ? (
            <button
              type="button"
              className={`navigate-toggle ${isNavPanelOpen ? "open is-hidden" : ""}`}
              onMouseEnter={() => {
                if (!isMobileViewport) {
                  setIsNavPanelOpen(true);
                }
              }}
              onFocus={() => {
                if (!isMobileViewport) {
                  setIsNavPanelOpen(true);
                }
              }}
              onClick={() => {
                if (!isNavPanelOpen) {
                  setIsNavPanelOpen(true);
                }
              }}
              aria-expanded={isNavPanelOpen}
            >
              Navigate
            </button>
          ) : null}

          <div
            ref={footerPanelRef}
            className={`footer-panel ${isNavPanelOpen ? "open" : "closed"}`}
          >
            <div
              className={`footer-nav-wrap relative flex gap-8 sm:gap-[3.2vw] ${
                isNavigateToggleMode && activeColumnBLines.length > 0 ? "has-col-b" : ""
              }`}
              style={isNavigateToggleMode ? { "--col-b-top": `${columnBTop}px` } : undefined}
              onMouseEnter={() => {
                cancelCloseMenu();
                cancelNavigatePanelClose();
              }}
              onMouseLeave={() => {
                queueCloseMenu();
                queueNavigatePanelClose();
              }}
            >
              <div
                className="footer-col-a min-w-0 text-[12px] leading-[1.35] tracking-[0.03em] uppercase text-[#b5b5b5] sm:text-[13px]"
              >
                <button
                  type="button"
                  className={`text-link block text-left ${
                    activeColumnAItem === FOOTER_MENU.titleId ? "text-[#000]" : ""
                  } ${
                    (FOOTER_MENU.columnBByItem[FOOTER_MENU.titleId] ?? []).length > 0 ? "cursor-default" : ""
                  }`}
                  onMouseEnter={(event) => activateColumnItem(FOOTER_MENU.titleId, event)}
                  onFocus={(event) => activateColumnItem(FOOTER_MENU.titleId, event)}
                  onClick={(event) => handleColumnAClick(FOOTER_MENU.titleId, event)}
                >
                  {FOOTER_MENU.title}
                </button>
                {FOOTER_MENU.columnA.map((item) =>
                  item.type === "spacer" ? (
                    <div key={item.key} className="h-3" />
                  ) : (
                    <button
                      key={item.id}
                      type="button"
                      className={`text-link block text-left ${
                        activeColumnAItem === item.id ? "text-[#000]" : ""
                      } ${
                        (FOOTER_MENU.columnBByItem[item.id] ?? []).length > 0 ? "cursor-default" : ""
                      }`}
                      onMouseEnter={(event) => activateColumnItem(item.id, event)}
                      onFocus={(event) => activateColumnItem(item.id, event)}
                      onClick={(event) => handleColumnAClick(item.id, event)}
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>

              <div
                className={`footer-col-b absolute left-full ml-8 min-w-[110px] text-[12px] leading-[1.35] tracking-[0.03em] uppercase sm:ml-[3.2vw] sm:text-[13px] transition-opacity duration-200 ${
                  activeColumnBLines.length > 0 ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                style={{ top: `${columnBTop}px` }}
                onMouseEnter={() => {
                  cancelCloseMenu();
                  cancelNavigatePanelClose();
                }}
                onFocus={cancelNavigatePanelClose}
              >
                {activeColumnBLines.map((line) => (
                  <button
                    key={line}
                    type="button"
                    className="text-link block text-left"
                    onMouseEnter={() => handleColumnBHighlight(line)}
                    onFocus={() => handleColumnBHighlight(line)}
                    onMouseLeave={() => setActiveColumnBItem(null)}
                    onBlur={() => setActiveColumnBItem(null)}
                    onClick={() => handleColumnBClick(line)}
                  >
                    {line}
                  </button>
                ))}
              </div>
            </div>
            {!isNavigateToggleMode ? <TextColumn lines={rightColumn} /> : null}
          </div>
        </footer>
      </section>

      <section
        role="button"
        tabIndex={0}
        onClick={skipIntro}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            skipIntro();
          }
        }}
        className={`intro absolute inset-0 transition-opacity duration-500 ${
          showIntro ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Intro quote overlay"
      >
        <div className="relative h-full w-full">
          <div
            className="absolute left-1/2 origin-top"
            style={{
              top: INTRO_CONFIG.containerTop,
              width: INTRO_CONFIG.containerWidth,
              transform: `translateX(-50%) scale(${introScale})`,
            }}
          >
            {lineTimings.lines.map((lineInfo) => {
              if (elapsedMs < lineInfo.start || elapsedMs > lineInfo.end) {
                return null;
              }

              const lineElapsed = elapsedMs - lineInfo.start;
              const lineFadeProgress = clamp(
                (elapsedMs - lineInfo.fadeStart) / (lineInfo.end - lineInfo.fadeStart),
                0,
                1
              );
              const lineOpacity = 1 - lineFadeProgress;

              return (
                <p
                  key={lineInfo.text}
                  className="absolute left-1/2 -translate-x-1/2 text-center text-[#2d2d2d] uppercase"
                  style={{
                    top: `${lineInfo.index * INTRO_CONFIG.lineGapPx + lineInfo.y}px`,
                    opacity: lineOpacity,
                    fontSize: INTRO_CONFIG.fontSize,
                    lineHeight: INTRO_CONFIG.lineHeight,
                    letterSpacing: INTRO_CONFIG.tracking,
                    whiteSpace: "nowrap",
                    transform: `translate3d(${lineInfo.x}px, 0, 0)`,
                  }}
                >
                  {lineInfo.words.map((word, wordIndex) => {
                    const wordElapsed = lineElapsed - wordIndex * INTRO_CONFIG.wordStaggerMs;
                    const wordProgress = clamp(wordElapsed / INTRO_CONFIG.wordRiseMs, 0, 1);
                    const eased = easeOutCubic(wordProgress);
                    const wordOpacity = lineOpacity * eased;
                    const offsetY = (1 - eased) * 28;

                    return (
                      <span
                        key={`${lineInfo.text}-${word}-${wordIndex}`}
                        className="intro-word"
                        style={{ opacity: wordOpacity, transform: `translate3d(0, ${offsetY}px, 0)` }}
                      >
                        {word}
                        {wordIndex < lineInfo.words.length - 1 ? "\u00A0" : ""}
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </div>
        </div>

        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[14px] uppercase tracking-[0.14em] text-[#8f8f8f]">
          Click to skip
        </p>
      </section>
      <SpeedInsights />
    </main>
  );
}

