import type { Stats, WorldContent, WorldState } from './types'

export function emptyStats(): Stats {
  return { heart: 0, coin: 0, bonds: 0, spirit: 0 }
}

export function cloneStats(stats: Stats): Stats {
  return { ...stats }
}

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value))
}

export function createWorldState(world: WorldContent): WorldState {
  const stats = cloneStats(world.startStats)
  return {
    worldId: world.id,
    status: 'new',
    chaptersDone: 0,
    cardIndex: 0,
    stats,
    statsAtLastExit: cloneStats(stats),
    flags: [],
    log: [],
    unseenRecap: [],
    lastExitAt: null,
  }
}

export function ensureWorldState(
  worlds: Record<string, WorldState>,
  world: WorldContent,
): WorldState {
  const existing = worlds[world.id]
  if (existing) return existing
  const created = createWorldState(world)
  worlds[world.id] = created
  return created
}
