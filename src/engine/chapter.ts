import { flagMet } from './conditions'
import type { Card, Chapter, WorldContent, WorldState } from './types'

export function currentChapter(
  world: WorldContent,
  state: WorldState,
): Chapter | null {
  return world.chapters[state.chaptersDone] ?? null
}

export function playableCards(chapter: Chapter, flags: string[]): Card[] {
  const matched = chapter.cards.filter((card) => flagMet(card.requires, flags))
  if (matched.length === 0) {
    // A chapter always plays at least one card: fall back to first card.
    const first = chapter.cards[0]
    return first ? [first] : []
  }
  return matched
}

export function currentCard(
  world: WorldContent,
  state: WorldState,
): Card | null {
  const chapter = currentChapter(world, state)
  if (!chapter) return null
  const cards = playableCards(chapter, state.flags)
  return cards[state.cardIndex] ?? null
}

export function chapterProgressLabel(
  world: WorldContent,
  state: WorldState,
): string {
  if (state.status === 'complete') {
    return `${world.chapters.length} of ${world.chapters.length}`
  }
  const next = Math.min(state.chaptersDone + 1, world.chapters.length)
  return `${next} of ${world.chapters.length}`
}
