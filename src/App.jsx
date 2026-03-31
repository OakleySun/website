import { useEffect, useMemo, useRef, useState } from "react";

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
    { type: "button", id: "education", label: "Education" },
    { type: "spacer", key: "sp-1" },
    { type: "button", id: "interests", label: "Interests" },
    { type: "spacer", key: "sp-2" },
    { type: "spacer", key: "sp-3" },
    { type: "spacer", key: "sp-4" },
    { type: "spacer", key: "sp-5" },
  ],
  columnBByItem: {
    projects: ["ChromaFM", "Loop"],
    interests: ["music", "fashion"],
    "oakley-sun": [],
  },
};

const PROJECT_PANELS = {
  chromafm: { label: "ChromaFM" },
  loop: { label: "Loop" },
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
      { label: "Built with", value: "React, Node.js/Express, Spotify API, OAuth" },
      { label: "Finished date", value: "January 2026" },
      {
        label: "Links",
        value: (
          <a
            href="https://github.com/OakleySun/ChromaFM"
            target="_blank"
            rel="noreferrer"
            className="text-link normal-case"
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
    subtitle: "Prototype Template",
    summary:
      "Prototype preview and notes. Add your process, what problem it solves, and implementation highlights here.",
    summaryDetail: (
      <>
        This paragraph can hold additional context and outcomes.{" "}
        <strong>Use bold text to emphasize key points.</strong>
      </>
    ),
    infoRow: [
      { label: "Built with", value: "TBD" },
      { label: "Finished date", value: "TBD" },
      { label: "Links", value: "TBD" },
    ],
    media: [],
  },
};
const rightColumn = [
  "",
  "",
  "",
];

// Intro animation controls. Edit this block to change copy, placement, size, and pacing.
const INTRO_CONFIG = {
  fontSize: "11px",
  lineHeight: 1.5,
  tracking: "0.01em",
  lineGapPx: 30,
  containerWidth: "min(82vw, 760px)",
  containerTop: "18vh",
  maxVisibleLines: 3,
  wordStaggerMs: 230,
  wordRiseMs: 1100,
  lineStartGapMs: 2100,
  lineFadeMs: 1300,
  fadeOutDelayAfterOverflowMs: 650,
  endingHoldMs: 1100,
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
    <div className="min-w-0 text-[10px] leading-[1.35] tracking-[0.03em] uppercase text-[#b5b5b5] sm:text-[11px]">
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

function ProjectsPanels({ visible, open }) {
  return (
    <div
      className={`cube-wrap pointer-events-none absolute left-1/2 top-[37%] grid h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 place-items-center transition-all duration-500 ease-in-out md:h-[220px] md:w-[220px] ${
        visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
      }`}
    >
      <div className={`unfold-wrap ${open ? "open" : ""}`}>
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
          <img
            key={activeItem.src}
            className="project-prototype-image"
            src={activeItem.src}
            alt={activeItem.label}
            onError={() => setShowFallback(true)}
          />
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
          <p
            className={`project-content-summary ${
              projectId === "chromafm" ? "" : "project-content-summary-detail"
            }`}
          >
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

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activeColumnAItem, setActiveColumnAItem] = useState(null);
  const [columnBTop, setColumnBTop] = useState(0);
  const [isCubeVisible, setIsCubeVisible] = useState(true);
  const [activeProjectScreen, setActiveProjectScreen] = useState(null);
  const closeMenuTimerRef = useRef(null);

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

  useEffect(
    () => () => {
      if (closeMenuTimerRef.current) {
        window.clearTimeout(closeMenuTimerRef.current);
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
  const activeColumnBLines = FOOTER_MENU.columnBByItem[activeColumnAItem] ?? [];
  const isProjectsActive = activeColumnAItem === "projects";
  const hasActiveProjectScreen = Boolean(activeProjectScreen);
  const activateColumnItem = (id, event) => {
    if (closeMenuTimerRef.current) {
      window.clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
    setActiveColumnAItem(id);
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
      closeMenuTimerRef.current = null;
    }, 260);
  };
  const cancelCloseMenu = () => {
    if (closeMenuTimerRef.current) {
      window.clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
  };
  const handleColumnAClick = (id) => {
    if (id !== "projects") {
      setActiveProjectScreen(null);
    }
  };
  const handleColumnBClick = (line) => {
    if (!isProjectsActive) {
      return;
    }

    const normalized = line.toLowerCase();
    if (normalized === "chromafm" || normalized === "loop") {
      setActiveProjectScreen(normalized);
      setActiveColumnAItem("projects");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#e5e5e5] font-['Montserrat',Arial,sans-serif]">
      <section
        className={`transition-opacity duration-700 ${
          showIntro ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Cube visible={isCubeVisible && !isProjectsActive && !hasActiveProjectScreen} />
        <ProjectsPanels visible={isCubeVisible && !hasActiveProjectScreen} open={isProjectsActive} />
        <ProjectContent key={activeProjectScreen ?? "none"} projectId={activeProjectScreen} />

        <footer className="absolute inset-x-0 bottom-1 flex flex-col items-start justify-between gap-6 px-6 sm:bottom-5 sm:flex-row sm:items-end sm:gap-[8vw] sm:px-[6vw]">
          <div
            className="relative flex gap-8 sm:gap-[3.2vw]"
            onMouseEnter={cancelCloseMenu}
            onMouseLeave={queueCloseMenu}
          >
            <div
              className="min-w-0 text-[10px] leading-[1.35] tracking-[0.03em] uppercase text-[#b5b5b5] sm:text-[11px]"
            >
              <button
                type="button"
                className={`text-link block text-left ${
                  activeColumnAItem === FOOTER_MENU.titleId ? "text-[#000]" : ""
                }`}
                onMouseEnter={(event) => activateColumnItem(FOOTER_MENU.titleId, event)}
                onFocus={(event) => activateColumnItem(FOOTER_MENU.titleId, event)}
                onClick={() => handleColumnAClick(FOOTER_MENU.titleId)}
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
                    }`}
                    onMouseEnter={(event) => activateColumnItem(item.id, event)}
                    onFocus={(event) => activateColumnItem(item.id, event)}
                    onClick={() => handleColumnAClick(item.id)}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>

            <div
              className={`absolute left-full ml-8 min-w-[110px] text-[10px] leading-[1.35] tracking-[0.03em] uppercase sm:ml-[3.2vw] sm:text-[11px] transition-opacity duration-200 ${
                activeColumnBLines.length > 0 ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{ top: `${columnBTop}px` }}
            >
              {activeColumnBLines.map((line) => (
                <button
                  key={line}
                  type="button"
                  className="text-link block text-left"
                  onClick={() => handleColumnBClick(line)}
                >
                  {line}
                </button>
              ))}
            </div>
          </div>
          <TextColumn lines={rightColumn} />
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
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: INTRO_CONFIG.containerTop, width: INTRO_CONFIG.containerWidth }}
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

        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.14em] text-[#8f8f8f]">
          Click to skip
        </p>
      </section>
    </main>
  );
}

