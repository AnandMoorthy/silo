import type { ChoiceLog, Stats, WorldContent, WorldState } from './types'
import { clampStat, cloneStats } from './worldState'

/** Reconstruct stats before the last visit's choices by reversing their effects. */
export function statsBeforeUnseenRecap(
  world: WorldContent,
  state: WorldState,
): Stats {
  const before = cloneStats(state.stats)
  const unseen = new Set(state.unseenRecap)
  const entries = state.log.filter((entry) => unseen.has(entry.cardId))

  for (const entry of [...entries].reverse()) {
    const card = world.chapters
      .flatMap((chapter) => chapter.cards)
      .find((c) => c.id === entry.cardId)
    if (!card) continue
    const choice = card[entry.pick]
    for (const [key, delta] of Object.entries(choice.effects)) {
      const statKey = key as keyof Stats
      before[statKey] = clampStat(before[statKey] - (delta ?? 0))
    }
  }

  return before
}

export function recapEntries(
  state: WorldState,
): ChoiceLog[] {
  const unseen = new Set(state.unseenRecap)
  return state.log.filter((entry) => unseen.has(entry.cardId))
}
