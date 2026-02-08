
import React, { useMemo } from "react";

type Variant = "swirl" | "hue";

export type ElectricCardProps = {
  /** Visual style: "swirl" = displacement + traveling turbulence; "hue" = animated hue turbulence */
  variant?: Variant;
  /** Accent / border color (any valid CSS color). */
  color?: string;
  /** Badge text in the top pill. */
  badge?: string;
  /** Title text. */
  title?: string;
  /** Description text. */
  description?: string;
  /** Optional background image */
  image?: string;

  /** Fixed card width (e.g. "22rem", "360px"). Default is 22rem (matches your demo). */
  width?: string;
  /** Aspect ratio of the card (e.g. "7 / 10", "3 / 4"). */
  aspectRatio?: string;

  /** Extra class names for the outer wrapper (optional). */
  className?: string;
};

/**
 * ElectricCard
 * Animated, dramatic glass/electric card with SVG filters and layered glow.
 *
 * Render multiple instances safely — filter IDs are unique per component.
 */
export const ElectricCard = ({
  variant = "swirl",
  color = "#dd8448", // original orange tone
  badge = "Dramatic",
  title = "Original",
  description = "In case you'd like to emphasize something very dramatically.",
  image,
  width = "100%", // Changed default to 100% to fit container
  aspectRatio = "16/9", // Changed default to video aspect
  className = "",
}: ElectricCardProps) => {
  // Make unique IDs so multiple components don't clash
  const ids = useMemo(() => {
    const key = Math.random().toString(36).slice(2, 8);
    return {
      swirl: `swirl-${key}`,
      hue: `hue-${key}`,
    };
  }, []);

  // Map variant -> CSS var that points to the proper filter url(#...)
  const filterURL = variant === "hue" ? `url(#${ids.hue})` : `url(#${ids.swirl})`;
  const bgStyle = image ? `url('${image}')` : 'oklch(0.145 0 0)';

  return (
    <div className={`ec-wrap ${className}`} style={{ width: '100%' }}>
      {/* Inline SVG defs with animated filters (unique IDs per instance) */}
      <svg className="svg-container" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          {/* SWIRL (↖️ in your demo) */}
          <filter id={ids.swirl} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="1" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="1" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="1" result="noise3" seed="2" />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="1" result="noise4" seed="2" />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>

            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>

          {/* HUE (🎨 in your demo) */}
          <filter id={ids.hue} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="1" />
            <feColorMatrix type="hueRotate" result="pt1">
              <animate attributeName="values" values="0;360;" dur=".6s" repeatCount="indefinite" calcMode="paced" />
            </feColorMatrix>
            <feComposite />
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="1" seed="5" />
            <feColorMatrix type="hueRotate" result="pt2">
              <animate
                attributeName="values"
                values="0; 333; 199; 286; 64; 168; 256; 157; 360;"
                dur="5s"
                repeatCount="indefinite"
                calcMode="paced"
              />
            </feColorMatrix>
            <feBlend in="pt1" in2="pt2" mode="normal" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      <div className="card-container" style={{ ["--electric-border-color" as any]: color, ["--f" as any]: filterURL }}>
        <div className="inner-container">
          <div className="border-outer">
            {/* this is the element that gets the SVG filter - purely for electric border effect now */}
            <div className="main-card" />
            {/* Clean Content Layer - sits on top of distorted border layer */}
            <div className="clean-image" style={{ backgroundImage: bgStyle }} />
          </div>
          <div className="glow-layer-1" />
          <div className="glow-layer-2" />
        </div>

        <div className="content-container">
          <div className="content-top">
            <div className="scrollbar-glass">{badge}</div>
            <p className="title">{title}</p>
          </div>

          <hr className="divider" />

          <div className="content-bottom">
            <p className="description">{description}</p>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --color-neutral-900: oklch(0.185 0 0);
        }

        .ec-wrap {
          position: relative;
          display: inline-block;
          color-scheme: light dark;
        }

        .svg-container {
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
        }

        .card-container {
          padding: 2px;
          border-radius: 1.5em;
          position: relative;
          /* gradient background uses accent color; fallback if invalid */
          --electric-light-color: oklch(from var(--electric-border-color) l c h);
          --gradient-color: oklch(from var(--electric-border-color) 0.3 calc(c / 2) h / 0.4);

          /* Removed internal gradient background to focus on image and border */
          background: var(--color-neutral-900);
          color: oklch(0.985 0 0);
        }

        .inner-container {
          position: relative;
        }

        .border-outer {
          border: 2px solid oklch(from var(--electric-border-color) l c h / 0.5);
          border-radius: 1.5em;
          padding-right: 0.15em;
          padding-bottom: 0.15em;
          position: relative; /* Ensure we can position clean-image absolute relative to this */
        }

        .main-card {
          width: ${width};
          aspect-ratio: ${aspectRatio};
          border-radius: 1.5em;
          border: 2px solid var(--electric-border-color);
          margin-top: -4px;
          margin-left: -4px;
          filter: var(--f);
          will-change: filter;
          /* gives subtle dark base so displacement reads nicely */
          background: oklch(0.145 0 0);
          transform: translateZ(0); /* Hardware acceleration hack */
        }

        .clean-image {
          position: absolute;
          inset: 0;
          border-radius: 1.4em; /* Slightly smaller radius to fit inside */
          background-size: cover;
          background-position: center;
          z-index: 1; /* Sits above main-card to be sharp */
          margin: 1px; /* Small inset to ensure border is visible */
        }

        /* Glow effects - retained only immediate border glow if needed, or removed */
        .glow-layer-1,
        .glow-layer-2 {
          border-radius: 24px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .glow-layer-1 {
          border: 2px solid oklch(from var(--electric-border-color) l c h / 0.6);
          filter: blur(1px);
        }

        .glow-layer-2 {
          border: 2px solid var(--electric-light-color);
          filter: blur(4px);
        }

        .content-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          z-index: 10; /* Ensure text is above the image */
          transition: background 0.4s ease;
        }
        
        /* Add dark overlay on hover to make text readable */
        .card-container:hover .content-container {
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, transparent 100%);
        }

        .content-top {
          display: flex;
          flex-direction: column;
          padding: 24px; /* Reduced padding for better fit */
          padding-bottom: 16px;
          height: 100%;
        }

        .content-bottom {
          display: flex;
          flex-direction: column;
          padding: 24px;
          padding-top: 16px;
        }

        .scrollbar-glass {
          background: radial-gradient(
              47.2% 50% at 50.39% 88.37%,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0) 100%
            ),
            rgba(255, 255, 255, 0.04);
          position: relative;
          transition: background 0.3s ease;
          border-radius: 14px;
          width: fit-content;
          height: fit-content;
          padding: 0.5em 1em;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.85em;
          color: rgba(255, 255, 255, 0.8);
        }
        .scrollbar-glass:hover {
          background: radial-gradient(
              47.2% 50% at 50.39% 88.37%,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0) 100%
            ),
            rgba(255, 255, 255, 0.08);
        }
        .scrollbar-glass::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          background: linear-gradient(
            150deg,
            rgba(255, 255, 255, 0.48) 16.73%,
            rgba(255, 255, 255, 0.08) 30.2%,
            rgba(255, 255, 255, 0.08) 68.2%,
            rgba(255, 255, 255, 0.6) 81.89%
          );
          border-radius: inherit;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask-composite: xor;
          pointer-events: none;
        }

        .title {
          font-size: 2.25em;
          font-weight: 500;
          margin-top: auto;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
          /* Hidden by default, reveal on hover */
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s ease-out;
        }
        .card-container:hover .title {
          opacity: 1;
          transform: translateY(0);
        }

        .description {
          opacity: 0;
          text-shadow: 0 2px 5px rgba(0,0,0,1);
          font-weight: 500;
          transform: translateY(20px);
          transition: all 0.4s ease-out 0.1s; /* Slight delay */
        }
        .card-container:hover .description {
          opacity: 1;
          transform: translateY(0);
        }

        .divider {
          margin-top: auto;
          border: none;
          height: 1px;
          background-color: currentColor;
          mask-image: linear-gradient(to right, transparent, black, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black, transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .card-container:hover .divider {
           opacity: 0.1;
        }
      `}</style>
    </div>
  );
};
