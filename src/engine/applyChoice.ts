import { cloneStats, clampStat } from './worldState'
import type {
  ChoiceLog,
  PickSide,
  Stats,
  WorldContent,
  WorldState,
} from './types'
import { currentCard, currentChapter, playableCards } from './chapter'
import { evaluateEndingCondition } from './conditions'

export function applyChoiceEffects(
  state: WorldState,
  world: WorldContent,
  pick: PickSide,
  at: string = new Date().toISOString(),
): { state: WorldState; logEntry: ChoiceLog; before: Stats } {
  const card = currentCard(world, state)
  if (!card) {
    throw new Error(`No current card in world "${world.id}"`)
  }
  const choice = card[pick]
  const before = cloneStats(state.stats)
  const nextStats = cloneStats(state.stats)
  for (const [key, delta] of Object.entries(choice.effects)) {
    const statKey = key as keyof Stats
    nextStats[statKey] = clampStat(nextStats[statKey] + (delta ?? 0))
  }

  const flags = [...state.flags]
  for (const flag of choice.sets ?? []) {
    if (!flags.includes(flag)) flags.push(flag)
  }

  const logEntry: ChoiceLog = {
    at,
    chapter: state.chaptersDone,
    cardId: card.id,
    pick,
    label: choice.label,
    result: choice.result,
    later: choice.later,
  }

  const next: WorldState = {
    ...state,
    status: state.status === 'new' ? 'in-progress' : state.status,
    stats: nextStats,
    flags,
    log: [...state.log, logEntry],
    unseenRecap: [...state.unseenRecap, card.id],
    cardIndex: state.cardIndex + 1,
  }

  return { state: next, logEntry, before }
}

export function finishChapter(
  state: WorldState,
  world: WorldContent,
  exitedAt: string = new Date().toISOString(),
): WorldState {
  const chaptersDone = state.chaptersDone + 1
  const next: WorldState = {
    ...state,
    chaptersDone,
    cardIndex: 0,
    lastExitAt: exitedAt,
    statsAtLastExit: cloneStats(state.stats),
    status: 'in-progress',
  }

  if (chaptersDone >= world.chapters.length) {
    const ending = pickEnding(world, next.stats)
    next.status = 'complete'
    next.endingText = ending
  }

  return next
}

export function pickEnding(world: WorldContent, stats: Stats): string {
  for (const ending of world.endings) {
    if (evaluateEndingCondition(ending.if, stats)) {
      return ending.text
    }
  }
  throw new Error(`World "${world.id}" matched no ending (default required).`)
}

export function isChapterFinished(
  world: WorldContent,
  state: WorldState,
): boolean {
  const chapter = currentChapter(world, state)
  if (!chapter) return true
  const cards = playableCards(chapter, state.flags)
  return state.cardIndex >= cards.length
}

export function clearRecap(state: WorldState): WorldState {
  return { ...state, unseenRecap: [] }
}
