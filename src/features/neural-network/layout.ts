import type { NavTier } from "./types";

/**
 * Collision boundary around the neural core.
 * The core ring is ~14.5rem wide (232px) plus the meta card below it.
 * We keep orbiting nodes well outside this footprint.
 */
export const CORE_COLLISION_RADIUS = 200;

/**
 * Half-widths used for collision math.
 * These approximate the visible bounding box of each node tier.
 */
const NODE_HALF_WIDTH: Record<NavTier, number> = {
  primary: 64,
  tertiary: 54,
};

const MIN_NODE_GAP = 44;

export interface NavLayoutSlot {
  navId: string;
  tier: NavTier;
  index: number;
}

export interface LayoutViewport {
  width: number;
  height: number;
}

function getWorkAreaHeight(viewport: LayoutViewport): number {
  const topbar = 50;
  const taskbar = 44;
  return viewport.height - topbar - taskbar;
}

/** Scale orbit radii to fill the available viewport without clipping. */
export function getLayoutScale(viewport: LayoutViewport): number {
  const workW = viewport.width;
  const workH = getWorkAreaHeight(viewport);
  const limiting = Math.min(workW, workH);

  if (limiting < 720) return 0.72;
  if (limiting < 900) return 0.84;
  if (limiting < 1100) return 0.94;
  return 1;
}

function getBaseOrbitRadius(viewport: LayoutViewport): number {
  const workW = viewport.width;
  const workH = getWorkAreaHeight(viewport);
  const limiting = Math.min(workW, workH);

  // Primary orbit: ~42% of limiting dimension — fills 70–80% of viewport
  const target = limiting * 0.42;
  return Math.max(330, Math.min(460, target));
}

function polarToXY(radius: number, angle: number): { x: number; y: number } {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
}

function nodeDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function minSeparation(tierA: NavTier, tierB: NavTier): number {
  return NODE_HALF_WIDTH[tierA] + NODE_HALF_WIDTH[tierB] + MIN_NODE_GAP;
}

/**
 * Separate primary and tertiary nodes onto distinct orbits.
 *
 * Primary tier sits on the inner orbit, tertiary on the outer orbit.
 * Both are distributed evenly on their own rings so they never intermix
 * or compete visually — the graph reads as two clean concentric layers.
 *
 * A lightweight collision-avoidance pass then expands orbits as needed
 * until adjacent nodes satisfy their minimum separation requirement.
 */
export function computeNavPositions(
  slots: NavLayoutSlot[],
  viewport: LayoutViewport,
): Map<string, { x: number; y: number }> {
  const scale = getLayoutScale(viewport);
  let innerRadius = getBaseOrbitRadius(viewport) * scale;
  let outerRadius = innerRadius * 1.28;

  // Guarantee primary nodes don't clip the core
  const minInner = CORE_COLLISION_RADIUS + NODE_HALF_WIDTH.primary + MIN_NODE_GAP;
  innerRadius = Math.max(innerRadius, minInner);
  outerRadius = Math.max(outerRadius, innerRadius * 1.26);

  const primarySlots = slots.filter((s) => s.tier === "primary");
  const tertiarySlots = slots.filter((s) => s.tier === "tertiary");

  // Each tier is distributed independently on its own ring, starting
  // from 270° (-π/2, straight up) for visual balance.
  const startAngle = -Math.PI / 2;

  function distributeOnRing(
    ring: NavLayoutSlot[],
    radius: number,
  ): Map<string, { x: number; y: number }> {
    const positions = new Map<string, { x: number; y: number }>();
    const n = ring.length;
    if (n === 0) return positions;
    const slice = (Math.PI * 2) / n;
    ring.forEach((slot, i) => {
      const angle = startAngle + i * slice;
      positions.set(slot.navId, polarToXY(radius, angle));
    });
    return positions;
  }

  const primaryPositions = distributeOnRing(primarySlots, innerRadius);
  const tertiaryPositions = distributeOnRing(tertiarySlots, outerRadius);

  const positions = new Map<string, { x: number; y: number }>([
    ...primaryPositions,
    ...tertiaryPositions,
  ]);

  const tiers = new Map<string, NavTier>(
    slots.map((s) => [s.navId, s.tier]),
  );

  // Collision-avoidance: push orbits outward until all adjacent pairs pass.
  for (let pass = 0; pass < 14; pass++) {
    let adjusted = false;

    // Check primary ring neighbours
    for (let i = 0; i < primarySlots.length; i++) {
      const j = (i + 1) % primarySlots.length;
      const idA = primarySlots[i]!.navId;
      const idB = primarySlots[j]!.navId;
      const dist = nodeDistance(positions.get(idA)!, positions.get(idB)!);
      const needed = minSeparation(tiers.get(idA)!, tiers.get(idB)!);

      if (dist < needed) {
        innerRadius += (needed - dist) * 0.6 + 6;
        primarySlots.forEach((slot, i) => {
          const angle = startAngle + i * ((Math.PI * 2) / primarySlots.length);
          positions.set(slot.navId, polarToXY(innerRadius, angle));
        });
        adjusted = true;
      }
    }

    // Check tertiary ring neighbours
    for (let i = 0; i < tertiarySlots.length; i++) {
      const j = (i + 1) % tertiarySlots.length;
      if (tertiarySlots.length < 2) break;
      const idA = tertiarySlots[i]!.navId;
      const idB = tertiarySlots[j]!.navId;
      const dist = nodeDistance(positions.get(idA)!, positions.get(idB)!);
      const needed = minSeparation(tiers.get(idA)!, tiers.get(idB)!);

      if (dist < needed) {
        outerRadius += (needed - dist) * 0.6 + 6;
        tertiarySlots.forEach((slot, i) => {
          const angle = startAngle + i * ((Math.PI * 2) / tertiarySlots.length);
          positions.set(slot.navId, polarToXY(outerRadius, angle));
        });
        adjusted = true;
      }
    }

    if (!adjusted) break;
  }

  return positions;
}
