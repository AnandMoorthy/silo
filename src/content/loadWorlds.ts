import bakery from './worlds/bakery.json'
import flood from './worlds/flood.json'
import lighthouse from './worlds/lighthouse.json'
import mars from './worlds/mars.json'
import signal from './worlds/signal.json'
import { parseWorldContent } from '../engine/schema'
import type { WorldContent } from '../engine/types'

const RAW_WORLDS: Array<{ raw: unknown; source: string }> = [
  { raw: lighthouse, source: 'src/content/worlds/lighthouse.json' },
  { raw: bakery, source: 'src/content/worlds/bakery.json' },
  { raw: mars, source: 'src/content/worlds/mars.json' },
  { raw: flood, source: 'src/content/worlds/flood.json' },
  { raw: signal, source: 'src/content/worlds/signal.json' },
]

export const WORLDS: WorldContent[] = RAW_WORLDS.map(({ raw, source }) =>
  parseWorldContent(raw, source),
)

export const WORLD_BY_ID: Record<string, WorldContent> = Object.fromEntries(
  WORLDS.map((world) => [world.id, world]),
)

export function requireWorld(worldId: string): WorldContent {
  const world = WORLD_BY_ID[worldId]
  if (!world) {
    throw new Error(`Unknown world id: ${worldId}`)
  }
  return world
}

export const WORLD_ACCENTS: Record<string, string> = {
  lighthouse: '#6eb6ff',
  bakery: '#e2a86a',
  mars: '#e07a5f',
  flood: '#5ec4b6',
  signal: '#c3a6ff',
}
