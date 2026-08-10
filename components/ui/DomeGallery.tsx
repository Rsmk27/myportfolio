import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';

type ImageItem = string | { src: string; alt?: string };

type DomeGalleryProps = {
  images?: ImageItem[];
  quality?: 'auto' | 'high' | 'medium' | 'low';
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
};

type ItemDef = {
  src: string;
  alt: string;
  x: number;
  y: number;
  sizeX: number;
  sizeY: number;
};

const DEFAULT_IMAGES: ImageItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Abstract art',
  },
  {
    src: 'https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Modern sculpture',
  },
  {
    src: 'https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Digital artwork',
  },
  {
    src: 'https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Contemporary art',
  },
  {
    src: 'https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Geometric pattern',
  },
  {
    src: 'https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Textured surface',
  },
  {
    src: 'https://pbs.twimg.com/media/Gyla7NnXMAAXSo_?format=jpg&name=large',
    alt: 'Social media image',
  },
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const normalizeAngle = (d: number) => ((d % 360) + 360) % 360;
const wrapAngleSigned = (deg: number) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el: HTMLElement, name: string, fallback: number) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

/** Detect if the primary input is touch (coarse) */
const isPrimaryTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/** Compute a viewport-safe opened image size.
 *  Uses a DOM probe to resolve any CSS value (px, vw, min(), clamp(), etc.)
 *  then clamps to 90vw × 82vh so it always fits on screen.
 */
function computeOpenedSize(
  requestedWidth: string,
  requestedHeight: string,
  frameWidth: number,
  frameHeight: number
): { width: string; height: string } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Use a hidden probe element to let the browser resolve any CSS expression
  const probe = document.createElement('div');
  probe.style.cssText = `position:fixed;visibility:hidden;pointer-events:none;width:${requestedWidth};height:${requestedHeight};`;
  document.body.appendChild(probe);
  const probeRect = probe.getBoundingClientRect();
  document.body.removeChild(probe);

  const resolvedW = probeRect.width > 0 ? probeRect.width : frameWidth;
  const resolvedH = probeRect.height > 0 ? probeRect.height : frameHeight;

  // Clamp to viewport safe area
  const safeW = Math.min(resolvedW, vw * 0.9);
  const safeH = Math.min(resolvedH, vh * 0.82);

  return { width: `${Math.round(safeW)}px`, height: `${Math.round(safeH)}px` };
}

function buildItems(pool: ImageItem[], seg: number, rows: 3 | 4 | 5): ItemDef[] {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ysBase = c % 2 === 0 ? evenYs : oddYs;
    let ys = ysBase;

    if (rows === 4) {
      ys = ysBase.slice(0, 4);
    } else if (rows === 3) {
      ys = ysBase.slice(1, 4);
    }

    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map((c) => ({ ...c, src: '', alt: '' }));
  }
  if (pool.length > totalSlots) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
    );
  }

  const normalizedImages = pool.map((image) => {
    if (typeof image === 'string') {
      return { src: image, alt: '' };
    }
    return { src: image.src || '', alt: image.alt || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt,
  }));
}

function computeItemBaseRotation(offsetX: number, offsetY: number, sizeX: number, sizeY: number, segments: number) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

function sampleImages(pool: ImageItem[], maxCount: number): ImageItem[] {
  if (pool.length <= maxCount) return pool;
  const step = pool.length / maxCount;
  return Array.from({ length: maxCount }, (_, i) => pool[Math.floor(i * step)]);
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  quality = 'auto',
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#060010',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '400px',
  openedImageHeight = '400px',
  imageBorderRadius = '30px',
  openedImageBorderRadius = '30px',
  grayscale = true,
}: DomeGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const focusedElRef = useRef<HTMLElement | null>(null);
  const originalTilePositionRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  const cancelTapRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef<number | null>(null);
  const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch'>('mouse');
  const tapTargetRef = useRef<HTMLElement | null>(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  const dragFrameRef = useRef<number | null>(null);
  const queuedRotationRef = useRef<{ x: number; y: number } | null>(null);
  // Track primary drag axis for smarter touch-action management
  const dragAxisRef = useRef<'x' | 'y' | null>(null);

  // ─── Performance tier ───
  // KEY FIX: Don't penalise touch devices by default; modern smartphones are fast.
  // Only downgrade for actual slow hardware (low memory / low CPU count).
  const perfTier = useMemo<'high' | 'medium' | 'low'>(() => {
    if (quality !== 'auto') return quality;
    if (typeof window === 'undefined') return 'high';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return 'low';

    const navWithMem = navigator as Navigator & { deviceMemory?: number };
    const mem = navWithMem.deviceMemory ?? 8;
    const cpu = navigator.hardwareConcurrency ?? 8;

    // Only go low for genuinely weak hardware
    if (mem <= 2 || cpu <= 2) return 'low';
    if (mem <= 4 || cpu <= 4) return 'medium';
    return 'high';
  }, [quality]);

  const effectiveSegments = useMemo(() => {
    const cappedSegments = Math.max(14, Math.min(segments, 35));
    if (perfTier === 'low') return Math.min(cappedSegments, 16);
    if (perfTier === 'medium') return Math.min(cappedSegments, 22);
    return cappedSegments;
  }, [perfTier, segments]);

  const effectiveRows = useMemo<3 | 4 | 5>(() => {
    if (perfTier === 'low') return 3;
    if (perfTier === 'medium') return 4;
    return 5;
  }, [perfTier]);

  const effectiveImages = useMemo(() => {
    const maxUnique = perfTier === 'low' ? 12 : perfTier === 'medium' ? 24 : 40;
    return sampleImages(images, maxUnique);
  }, [images, perfTier]);

  const enableBackdropBlur = false;
  const enableEdgeGradients = perfTier !== 'low';
  const effectiveGrayscale = grayscale && perfTier === 'high';
  const overlayShadow = perfTier === 'low' ? 'none' : '0 10px 30px rgba(0,0,0,.35)';

  // ─── Drag sensitivity: touch fingers need lower sensitivity (larger denominator) ───
  const effectiveDragSensitivity = useMemo(() => {
    if (typeof window === 'undefined') return dragSensitivity;
    // Touch users move farther physically; reduce sensitivity to prevent over-rotation
    return isPrimaryTouch() ? dragSensitivity * 1.35 : dragSensitivity;
  }, [dragSensitivity]);

  // ─── Scroll lock ───
  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
    scrollLockedRef.current = false;
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }, []);

  const items = useMemo(() => buildItems(effectiveImages, effectiveSegments, effectiveRows), [effectiveImages, effectiveRows, effectiveSegments]);

  // ─── Direct DOM transform — avoid React re-renders during drag ───
  const applyTransform = (xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  // Batch transforms into a single rAF to avoid mid-frame repaints
  const scheduleTransform = useCallback((xDeg: number, yDeg: number) => {
    queuedRotationRef.current = { x: xDeg, y: yDeg };
    if (dragFrameRef.current !== null) return;

    dragFrameRef.current = requestAnimationFrame(() => {
      const next = queuedRotationRef.current;
      dragFrameRef.current = null;
      if (!next) return;
      applyTransform(next.x, next.y);
    });
  }, []);

  const lockedRadiusRef = useRef<number | null>(null);

  // ─── ResizeObserver for responsive radius & overlay repositioning ───
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      const maxDim = Math.max(w, h);
      const aspect = w / h;
      let basis: number;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', effectiveGrayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement;
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();

        const { width: safeW, height: safeH } = computeOpenedSize(
          openedImageWidth,
          openedImageHeight,
          frameR.width,
          frameR.height
        );

        const centeredLeft = frameR.left - mainR.left + (frameR.width - parseFloat(safeW)) / 2;
        const centeredTop = frameR.top - mainR.top + (frameR.height - parseFloat(safeH)) / 2;

        enlargedOverlay.style.left = `${centeredLeft}px`;
        enlargedOverlay.style.top = `${centeredTop}px`;
        enlargedOverlay.style.width = safeW;
        enlargedOverlay.style.height = safeH;
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    effectiveGrayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight,
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  // ─── Inertia ───
  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx: number, vy: number) => {
      const MAX_V = 2.0;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      // Slightly different friction for touch to feel more natural
      const isTouch = pointerTypeRef.current === 'touch';
      const frictionMul = isTouch ? 0.955 + 0.04 * d : 0.94 + 0.055 * d;
      const stopThreshold = 0.012 - 0.008 * d;
      const maxFrames = Math.round(120 + 300 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        scheduleTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, scheduleTransform, stopInertia]
  );

  // ─── Open item ───
  const openItemFromElement = useCallback(
    (el: HTMLElement) => {
      if (openingRef.current) return;
      openingRef.current = true;
      openStartedAtRef.current = performance.now();
      lockScroll();
      const parent = el.parentElement as HTMLElement;
      focusedElRef.current = el;
      el.setAttribute('data-focused', 'true');
      const offsetX = getDataNumber(parent, 'offsetX', 0);
      const offsetY = getDataNumber(parent, 'offsetY', 0);
      const sizeX = getDataNumber(parent, 'sizeX', 2);
      const sizeY = getDataNumber(parent, 'sizeY', 2);
      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, effectiveSegments);
      const parentY = normalizeAngle(parentRot.rotateY);
      const globalY = normalizeAngle(rotationRef.current.y);
      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -parentRot.rotateX - rotationRef.current.x;
      parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
      parent.style.setProperty('--rot-x-delta', `${rotX}deg`);
      const refDiv = document.createElement('div');
      refDiv.className = 'item__image item__image--reference opacity-0';
      refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
      parent.appendChild(refDiv);

      void refDiv.offsetHeight;

      const tileR = refDiv.getBoundingClientRect();
      const mainR = mainRef.current?.getBoundingClientRect();
      const frameR = frameRef.current?.getBoundingClientRect();

      if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
        openingRef.current = false;
        focusedElRef.current = null;
        parent.removeChild(refDiv);
        unlockScroll();
        return;
      }

      originalTilePositionRef.current = {
        left: tileR.left,
        top: tileR.top,
        width: tileR.width,
        height: tileR.height,
      };
      el.style.visibility = 'hidden';
      el.style.zIndex = '0';

      const overlay = document.createElement('div');
      overlay.className = 'enlarge';

      // Compute a viewport-safe opened size
      const { width: safeW, height: safeH } = computeOpenedSize(
        openedImageWidth,
        openedImageHeight,
        frameR.width,
        frameR.height
      );

      overlay.style.cssText = `position:absolute; left:${frameR.left - mainR.left}px; top:${frameR.top - mainR.top}px; width:${frameR.width}px; height:${frameR.height}px; opacity:0; z-index:30; will-change:transform,opacity,left,top,width,height; transform-origin:top left; transition:transform ${enlargeTransitionMs}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${enlargeTransitionMs}ms ease; border-radius:${openedImageBorderRadius}; overflow:hidden; box-shadow:${overlayShadow};`;

      const rawSrc = parent.dataset.src || (el.querySelector('img') as HTMLImageElement)?.src || '';
      const rawAlt = parent.dataset.alt || (el.querySelector('img') as HTMLImageElement)?.alt || '';
      const img = document.createElement('img');
      img.src = rawSrc;
      img.alt = rawAlt;
      img.style.cssText = `width:100%; height:100%; object-fit:cover; filter:${effectiveGrayscale ? 'grayscale(1)' : 'none'};`;
      overlay.appendChild(img);
      viewerRef.current?.appendChild(overlay);

      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;

      const validSx0 = Number.isFinite(sx0) && sx0 > 0 ? sx0 : 1;
      const validSy0 = Number.isFinite(sy0) && sy0 > 0 ? sy0 : 1;

      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

      // Double rAF ensures the browser has had a chance to paint the initial state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!overlay.parentElement) return;
          overlay.style.opacity = '1';
          overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
          rootRef.current?.setAttribute('data-enlarging', 'true');
        });
      });

      // After fly-in completes, resize to desired dimensions
      const onFirstEnd = (ev: TransitionEvent) => {
        if (ev.propertyName !== 'transform') return;
        overlay.removeEventListener('transitionend', onFirstEnd);

        const centeredLeft = frameR.left - mainR.left + (frameR.width - parseFloat(safeW)) / 2;
        const centeredTop = frameR.top - mainR.top + (frameR.height - parseFloat(safeH)) / 2;

        // Snap to exact destination without transition, then animate resize
        overlay.style.transition = 'none';
        void overlay.offsetWidth; // force reflow

        const resizeDuration = Math.round(enlargeTransitionMs * 0.75);
        overlay.style.transition = `left ${resizeDuration}ms cubic-bezier(0.25,0.46,0.45,0.94), top ${resizeDuration}ms cubic-bezier(0.25,0.46,0.45,0.94), width ${resizeDuration}ms cubic-bezier(0.25,0.46,0.45,0.94), height ${resizeDuration}ms cubic-bezier(0.25,0.46,0.45,0.94)`;

        requestAnimationFrame(() => {
          overlay.style.left = `${centeredLeft}px`;
          overlay.style.top = `${centeredTop}px`;
          overlay.style.width = safeW;
          overlay.style.height = safeH;
        });

        overlay.addEventListener(
          'transitionend',
          () => {
            overlay.style.transition = '';
          },
          { once: true }
        );
      };

      overlay.addEventListener('transitionend', onFirstEnd);
    },
    [effectiveGrayscale, effectiveSegments, enlargeTransitionMs, lockScroll, openedImageBorderRadius, openedImageHeight, openedImageWidth, overlayShadow, unlockScroll]
  );

  // ─── Drag / tap gesture (use-gesture) ───
  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();
        dragAxisRef.current = null;

        const evt = event as PointerEvent;
        pointerTypeRef.current = (evt.pointerType as 'mouse' | 'pen' | 'touch') || 'mouse';
        draggingRef.current = true;
        cancelTapRef.current = false;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
        const potential = (evt.target as Element).closest?.('.item__image') as HTMLElement | null;
        tapTargetRef.current = potential || null;
      },

      onDrag: ({ event, last, velocity: velArr = [0, 0], direction: dirArr = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;

        const evt = event as PointerEvent;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;

        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
          if (dist2 > 16) {
            movedRef.current = true;
            // Determine primary axis on first significant move
            if (dragAxisRef.current === null) {
              dragAxisRef.current = Math.abs(dxTotal) >= Math.abs(dyTotal) ? 'x' : 'y';
              // Lock scroll only if horizontal drag (dome rotation)
              if (dragAxisRef.current === 'x') {
                lockScroll();
              }
            }
          }
        }

        // Only prevent default when we've locked our scroll (horizontal drag)
        if (pointerTypeRef.current === 'touch' && dragAxisRef.current === 'x') {
          evt.preventDefault?.();
        }

        const nextX = clamp(
          startRotRef.current.x - dyTotal / effectiveDragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = startRotRef.current.y + dxTotal / effectiveDragSensitivity;

        const cur = rotationRef.current;
        if (cur.x !== nextX || cur.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY };
          scheduleTransform(nextX, nextY);
        }

        if (last) {
          draggingRef.current = false;
          let isTap = false;

          if (startPosRef.current) {
            const dx = evt.clientX - startPosRef.current.x;
            const dy = evt.clientY - startPosRef.current.y;
            const dist2 = dx * dx + dy * dy;
            // Touch taps have a larger tolerance (finger imprecision)
            const TAP_THRESH_PX = pointerTypeRef.current === 'touch' ? 12 : 6;
            if (dist2 <= TAP_THRESH_PX * TAP_THRESH_PX) {
              isTap = true;
            }
          }

          let [vMagX, vMagY] = velArr;
          const [dirX, dirY] = dirArr;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;

          if (!isTap && Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement;
            vx = (mx / effectiveDragSensitivity) * 0.02;
            vy = (my / effectiveDragSensitivity) * 0.02;
          }

          if (!isTap && (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)) {
            startInertia(vx, vy);
          }

          startPosRef.current = null;
          cancelTapRef.current = !isTap;

          if (isTap && tapTargetRef.current && !focusedElRef.current) {
            openItemFromElement(tapTargetRef.current);
          }
          tapTargetRef.current = null;
          dragAxisRef.current = null;

          if (cancelTapRef.current) setTimeout(() => (cancelTapRef.current = false), 150);
          unlockScroll();
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      },
    },
    { target: mainRef, eventOptions: { passive: false } }
  );

  // ─── Scrim / close handler ───
  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;

    const close = () => {
      if (performance.now() - openStartedAtRef.current < 280) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent = el.parentElement as HTMLElement;
      const overlay = viewerRef.current?.querySelector('.enlarge') as HTMLElement | null;
      if (!overlay) return;

      const refDiv = parent.querySelector('.item__image--reference') as HTMLElement | null;
      const originalPos = originalTilePositionRef.current;

      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        el.style.visibility = '';
        el.style.zIndex = '0';
        focusedElRef.current = null;
        rootRef.current?.removeAttribute('data-enlarging');
        openingRef.current = false;
        unlockScroll();
        return;
      }

      const currentRect = overlay.getBoundingClientRect();
      const rootRect = rootRef.current?.getBoundingClientRect();
      if (!rootRect) return;

      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height,
      };

      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height,
      };

      const animatingOverlay = document.createElement('div');
      animatingOverlay.className = 'enlarge-closing';
      animatingOverlay.style.cssText = `
        position: absolute;
        left: ${overlayRelativeToRoot.left}px;
        top: ${overlayRelativeToRoot.top}px;
        width: ${overlayRelativeToRoot.width}px;
        height: ${overlayRelativeToRoot.height}px;
        z-index: 9999;
        border-radius: ${openedImageBorderRadius};
        overflow: hidden;
        box-shadow: ${overlayShadow};
        transition: left ${enlargeTransitionMs}ms cubic-bezier(0.25,0.46,0.45,0.94), top ${enlargeTransitionMs}ms cubic-bezier(0.25,0.46,0.45,0.94), width ${enlargeTransitionMs}ms cubic-bezier(0.25,0.46,0.45,0.94), height ${enlargeTransitionMs}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${enlargeTransitionMs}ms ease;
        pointer-events: none;
        margin: 0;
        transform: none;
        will-change: left, top, width, height, opacity;
        filter: ${effectiveGrayscale ? 'grayscale(1)' : 'none'};
      `;

      const originalImg = overlay.querySelector('img');
      if (originalImg) {
        const img = originalImg.cloneNode() as HTMLImageElement;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
        animatingOverlay.appendChild(img);
      }

      overlay.remove();
      if (rootRef.current) rootRef.current.appendChild(animatingOverlay);

      // Force layout before triggering animation
      void animatingOverlay.getBoundingClientRect();

      requestAnimationFrame(() => {
        animatingOverlay.style.left = `${originalPosRelativeToRoot.left}px`;
        animatingOverlay.style.top = `${originalPosRelativeToRoot.top}px`;
        animatingOverlay.style.width = `${originalPosRelativeToRoot.width}px`;
        animatingOverlay.style.height = `${originalPosRelativeToRoot.height}px`;
        animatingOverlay.style.opacity = '0';
      });

      const cleanup = () => {
        animatingOverlay.remove();
        originalTilePositionRef.current = null;

        if (refDiv) refDiv.remove();
        parent.style.transition = 'none';
        el.style.transition = 'none';
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');

        requestAnimationFrame(() => {
          el.style.visibility = '';
          el.style.opacity = '0';
          el.style.zIndex = '0';
          focusedElRef.current = null;
          rootRef.current?.removeAttribute('data-enlarging');

          requestAnimationFrame(() => {
            parent.style.transition = '';
            el.style.transition = 'opacity 280ms ease-out';

            requestAnimationFrame(() => {
              el.style.opacity = '1';
              setTimeout(() => {
                el.style.transition = '';
                el.style.opacity = '';
                openingRef.current = false;
                unlockScroll();
              }, 280);
            });
          });
        });
      };

      animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
      // Fallback cleanup in case transitionend doesn't fire (e.g. element removed)
      setTimeout(cleanup, enlargeTransitionMs + 100);
    };

    // Handle both click and touch tap on scrim
    const onScrimClick = (e: Event) => {
      e.stopPropagation();
      close();
    };

    scrim.addEventListener('click', onScrimClick);
    scrim.addEventListener('touchend', onScrimClick, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      scrim.removeEventListener('click', onScrimClick);
      scrim.removeEventListener('touchend', onScrimClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [effectiveGrayscale, enlargeTransitionMs, openedImageBorderRadius, overlayShadow, unlockScroll]);

  // ─── Cleanup on unmount ───
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      if (dragFrameRef.current !== null) {
        cancelAnimationFrame(dragFrameRef.current);
      }
      if (inertiaRAF.current !== null) {
        cancelAnimationFrame(inertiaRAF.current);
      }
    };
  }, []);

  // ─── CSS ───
  const cssStyles = `
    .sphere-root {
      --radius: 520px;
      --viewer-pad: 72px;
      --circ: calc(var(--radius) * 3.14);
      --rot-y: calc((360deg / var(--segments-x)) / 2);
      --rot-x: calc((360deg / var(--segments-y)) / 2);
      --item-width: calc(var(--circ) / var(--segments-x));
      --item-height: calc(var(--circ) / var(--segments-y));
    }

    .sphere-root * { box-sizing: border-box; }
    .sphere, .sphere-item, .item__image { transform-style: preserve-3d; }

    .stage {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      position: absolute;
      inset: 0;
      margin: auto;
      perspective: calc(var(--radius) * 2);
      perspective-origin: 50% 50%;
    }

    .sphere {
      transform: translateZ(calc(var(--radius) * -1));
      will-change: transform;
      position: absolute;
    }

    .sphere-item {
      width: calc(var(--item-width) * var(--item-size-x));
      height: calc(var(--item-height) * var(--item-size-y));
      position: absolute;
      top: -999px;
      bottom: -999px;
      left: -999px;
      right: -999px;
      margin: auto;
      transform-origin: 50% 50%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transition: transform 180ms;
      transform: rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg)))
                 rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg)))
                 translateZ(var(--radius));
      will-change: transform;
      /*
       * KEY PERF FIX: Isolate each tile as its own paint boundary.
       * When an image inside loads/decodes, the browser only repaints THIS tile,
       * not the entire sphere — so rotation stays smooth during network activity.
       * Note: cannot use 'contain: strict' because transform-style:preserve-3d
       * requires 'layout' & 'paint' but not 'size'.
       */
      contain: layout paint style;
    }

    .sphere-root[data-enlarging="true"] .scrim {
      opacity: 1 !important;
      pointer-events: all !important;
    }

    @media (max-aspect-ratio: 1/1) {
      .viewer-frame {
        height: auto !important;
        width: 100% !important;
      }
    }

    .item__image {
      position: absolute;
      inset: 10px;
      border-radius: var(--tile-radius, 12px);
      overflow: hidden;
      cursor: pointer;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      transition: transform 180ms;
      pointer-events: auto;
      will-change: transform;
      /* Shimmer placeholder while image loads */
      background: linear-gradient(
        110deg,
        #0d1117 25%,
        #151c25 45%,
        #1a2333 50%,
        #151c25 55%,
        #0d1117 75%
      );
      background-size: 300% 100%;
      animation: dg-shimmer 1.8s ease-in-out infinite;
      /* iOS */
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    /* Stop shimmer once image is loaded (class toggled via JS) */
    .item__image.dg-loaded {
      background: none;
      animation: none;
    }

    @keyframes dg-shimmer {
      0%   { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }

    /* Image itself fades in after decode to avoid flash */
    .item__image img {
      opacity: 0;
      transition: opacity 300ms ease;
    }
    .item__image.dg-loaded img {
      opacity: 1;
    }

    .item__image--reference {
      position: absolute;
      inset: 10px;
      pointer-events: none;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
      <div
        ref={rootRef}
        className="sphere-root relative w-full h-full"
        style={{
          ['--segments-x' as string]: effectiveSegments,
          ['--segments-y' as string]: effectiveSegments,
          ['--overlay-blur-color' as string]: overlayBlurColor,
          ['--tile-radius' as string]: imageBorderRadius,
          ['--enlarge-radius' as string]: openedImageBorderRadius,
          ['--image-filter' as string]: effectiveGrayscale ? 'grayscale(1)' : 'none',
        } as React.CSSProperties}
      >
        <main
          ref={mainRef}
          className="absolute inset-0 grid place-items-center overflow-hidden select-none bg-transparent"
          style={{
            // Use 'pan-y' instead of 'none' so vertical page scroll still works
            // We dynamically prevent default on horizontal drags in the handler
            touchAction: 'pan-y',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            // Suppress iOS magnification long-press
            WebkitTouchCallout: 'none',
          } as React.CSSProperties}
        >
          <div className="stage">
            <div ref={sphereRef} className="sphere">
              {items.map((it, i) => {
                /*
                 * Loading priority strategy:
                 * - Tiles near the front face (|x| ≤ 4) load eagerly with higher priority
                 *   so the visible dome has images immediately.
                 * - All others use lazy + low priority to avoid saturating the network
                 *   and blocking the main thread during initial rotation.
                 */
                const isFrontFacing = Math.abs(it.x) <= 4;
                const imgLoading = isFrontFacing ? 'eager' : 'lazy';
                const imgPriority = isFrontFacing ? 'high' : 'low';

                return (
                  <div
                    key={`${it.x},${it.y},${i}`}
                    className="sphere-item absolute m-auto"
                    data-src={it.src}
                    data-alt={it.alt}
                    data-offset-x={it.x}
                    data-offset-y={it.y}
                    data-size-x={it.sizeX}
                    data-size-y={it.sizeY}
                    style={{
                      ['--offset-x' as string]: it.x,
                      ['--offset-y' as string]: it.y,
                      ['--item-size-x' as string]: it.sizeX,
                      ['--item-size-y' as string]: it.sizeY,
                      top: '-999px',
                      bottom: '-999px',
                      left: '-999px',
                      right: '-999px',
                    } as React.CSSProperties}
                  >
                    <div
                      className="item__image absolute block overflow-hidden cursor-pointer transition-transform duration-300"
                      role="button"
                      tabIndex={0}
                      aria-label={it.alt || 'Open image'}
                      onClick={(e) => {
                        if (draggingRef.current) return;
                        if (movedRef.current) return;
                        if (performance.now() - lastDragEndAt.current < 100) return;
                        if (openingRef.current) return;
                        openItemFromElement(e.currentTarget as HTMLElement);
                      }}
                      onPointerUp={(e) => {
                        if ((e.nativeEvent as PointerEvent).pointerType !== 'touch') return;
                        if (draggingRef.current) return;
                        if (movedRef.current) return;
                        if (performance.now() - lastDragEndAt.current < 100) return;
                        if (openingRef.current) return;
                        openItemFromElement(e.currentTarget as HTMLElement);
                      }}
                      style={{
                        inset: '10px',
                        borderRadius: `var(--tile-radius, ${imageBorderRadius})`,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      } as React.CSSProperties}
                    >
                      <img
                        src={it.src}
                        draggable={false}
                        alt={it.alt}
                        loading={imgLoading}
                        decoding="async"
                        fetchPriority={imgPriority}
                        className="w-full h-full object-cover pointer-events-none"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          filter: `var(--image-filter, ${effectiveGrayscale ? 'grayscale(1)' : 'none'})`,
                          WebkitUserDrag: 'none',
                        } as React.CSSProperties}
                        onLoad={(e) => {
                          // Mark tile as loaded: removes shimmer, fades in the image
                          const tile = (e.currentTarget as HTMLImageElement).parentElement;
                          if (tile) tile.classList.add('dg-loaded');
                        }}
                        onError={(e) => {
                          // On error, still remove shimmer so it doesn't spin forever
                          const tile = (e.currentTarget as HTMLImageElement).parentElement;
                          if (tile) tile.classList.add('dg-loaded');
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radial fade-out vignette */}
          <div
            className="absolute inset-0 m-auto z-[3] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, ${overlayBlurColor}) 100%)`,
            }}
          />

          {enableBackdropBlur && (
            <div
              className="absolute inset-0 m-auto z-[3] pointer-events-none"
              style={{
                WebkitMaskImage: `radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,
                maskImage: `radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, ${overlayBlurColor}) 90%)`,
                backdropFilter: 'blur(2px)',
              }}
            />
          )}

          {enableEdgeGradients && (
            <>
              <div
                className="absolute left-0 right-0 top-0 h-[96px] z-[5] pointer-events-none rotate-180"
                style={{
                  background: `linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))`,
                }}
              />
              <div
                className="absolute left-0 right-0 bottom-0 h-[96px] z-[5] pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, transparent, var(--overlay-blur-color, ${overlayBlurColor}))`,
                }}
              />
            </>
          )}

          {/* Viewer overlay (scrim + frame) */}
          <div
            ref={viewerRef}
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
            style={{ padding: 'var(--viewer-pad)' }}
          >
            <div
              ref={scrimRef}
              className="scrim absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500"
              style={{
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: enableBackdropBlur ? 'blur(2px)' : 'none',
              }}
            />
            <div
              ref={frameRef}
              className="viewer-frame h-full aspect-square flex"
              style={{
                borderRadius: `var(--enlarge-radius, ${openedImageBorderRadius})`,
              }}
            />
          </div>
        </main>
      </div>
    </>
  );
}
