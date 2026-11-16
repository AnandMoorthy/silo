export const STAT_KEYS = ['heart', 'coin', 'bonds', 'spirit'] as const
export type StatKey = (typeof STAT_KEYS)[number]
export type Stats = Record<StatKey, number>
export type PickSide = 'a' | 'b'

export interface ChoiceEffect {
  label: string
  effects: Partial<Record<StatKey, number>>
  sets?: string[]
  result: string
  later: string
}

export interface Card {
  id: string
  requires?: string
  speaker: string
  text: string
  a: ChoiceEffect
  b: ChoiceEffect
}

export interface Chapter {
  title: string
  cards: Card[]
}

export interface Ending {
  if?: string
  text: string
}

export interface WorldContent {
  id: string
  title: string
  role: string
  tagline: string
  statLabels: Record<StatKey, string>
  startStats: Stats
  facts: Record<string, string>
  chapters: Chapter[]
  endings: Ending[]
}

export interface ChoiceLog {
  at: string
  chapter: number
  cardId: string
  pick: PickSide
  label: string
  result: string
  later: string
}

export type WorldStatus = 'new' | 'in-progress' | 'complete'

export interface WorldState {
  worldId: string
  status: WorldStatus
  chaptersDone: number
  cardIndex: number
  stats: Stats
  statsAtLastExit: Stats
  flags: string[]
  log: ChoiceLog[]
  unseenRecap: string[]
  lastExitAt: string | null
  endingText?: string
}

export interface Save {
  version: 2
  worlds: Record<string, WorldState>
}

export const SAVE_KEY = 'silo.save.v2'

export type Screen =
  | { name: 'home' }
  | { name: 'recap'; worldId: string }
  | { name: 'world'; worldId: string }
  | { name: 'card'; worldId: string }
  | { name: 'result'; worldId: string; pick: PickSide; before: Stats }
  | { name: 'chapterEnd'; worldId: string; sessionChoices: ChoiceLog[] }
  | { name: 'ending'; worldId: string }
  | { name: 'log'; worldId: string }
