import type { ReactNode } from 'react'

type MotifSize = 'sm' | 'md' | 'lg'

const SIZE_PX: Record<MotifSize, number> = {
  sm: 40,
  md: 56,
  lg: 88,
}

function MotifFrame({
  size,
  label,
  children,
}: {
  size: MotifSize
  label: string
  children: ReactNode
}) {
  const px = SIZE_PX[size]
  return (
    <svg
      className={`world-motif world-motif--${size}`}
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  )
}

/** Lighthouse tower + soft beam arcs */
function LighthouseMotif({ size }: { size: MotifSize }) {
  return (
    <MotifFrame size={size} label="Lighthouse motif">
      <path
        d="M10 50h44"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M28 50V22h8v28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="26" y="16" width="12" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="32" cy="13" r="2.5" fill="currentColor" />
      <path
        d="M38 18c8 2 14 8 16 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M38 22c5 1.5 9 5.5 11 11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.35"
      />
    </MotifFrame>
  )
}

/** Oven arch + rising heat lines */
function BakeryMotif({ size }: { size: MotifSize }) {
  return (
    <MotifFrame size={size} label="Bakery motif">
      <path
        d="M14 48V30c0-10 8-16 18-16s18 6 18 16v18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 48h36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 48V36c0-4.5 3.5-8 8-8s8 3.5 8 8v12"
        stroke="currentColor"
        strokeWidth="1.75"
        opacity="0.7"
      />
      <path
        d="M28 14c0-3 1.5-5 4-5s4 2 4 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M36 12c0-2.5 1-4 2.5-4s2.5 1.5 2.5 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.4"
      />
    </MotifFrame>
  )
}

/** Mars disc + tiny habitat mark */
function MarsMotif({ size }: { size: MotifSize }) {
  return (
    <MotifFrame size={size} label="Mars motif">
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.85"
      />
      <path
        d="M16 28c6 2 10-4 16-2s10 4 16 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M18 40c5-1 9 3 14 2s9-3 14 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.35"
      />
      <rect
        x="27"
        y="34"
        width="10"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M29 34v-3h6v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </MotifFrame>
  )
}

/** Water lines + school roof triangle */
function FloodMotif({ size }: { size: MotifSize }) {
  return (
    <MotifFrame size={size} label="Flood motif">
      <path
        d="M12 44c4-3 8-3 12 0s8 3 12 0 8-3 12 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M12 50c4-3 8-3 12 0s8 3 12 0 8-3 12 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M20 34h24v8H20z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M18 34l14-10 14 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <rect x="30" y="36" width="4" height="6" fill="currentColor" opacity="0.8" />
    </MotifFrame>
  )
}

/** Radio mast + signal arcs */
function SignalMotif({ size }: { size: MotifSize }) {
  return (
    <MotifFrame size={size} label="Signal motif">
      <path
        d="M32 50V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="14" r="3" fill="currentColor" />
      <path
        d="M22 50h20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M38 22c4 3 6 8 6 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M42 18c7 5 10 12 10 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M26 22c-4 3-6 8-6 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
    </MotifFrame>
  )
}

const MOTIFS: Record<
  string,
  (props: { size: MotifSize }) => ReactNode
> = {
  lighthouse: LighthouseMotif,
  bakery: BakeryMotif,
  mars: MarsMotif,
  flood: FloodMotif,
  signal: SignalMotif,
}

export function WorldMotif({
  worldId,
  size = 'md',
}: {
  worldId: string
  size?: MotifSize
}) {
  const Motif = MOTIFS[worldId]
  if (!Motif) return null
  return (
    <div className="world-motif-wrap" aria-hidden={false}>
      <Motif size={size} />
    </div>
  )
}
