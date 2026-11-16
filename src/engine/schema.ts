import { z } from 'zod'
import { STAT_KEYS, type WorldContent } from './types'

const StatKeySchema = z.enum(STAT_KEYS)

const EffectsSchema = z
  .record(z.string(), z.number().int())
  .superRefine((effects, ctx) => {
    for (const key of Object.keys(effects)) {
      if (!(STAT_KEYS as readonly string[]).includes(key)) {
        ctx.addIssue({
          code: 'custom',
          message: `Unknown stat "${key}". Expected one of: ${STAT_KEYS.join(', ')}`,
        })
      }
    }
  })
  .transform((effects) => effects as Partial<Record<(typeof STAT_KEYS)[number], number>>)

const ChoiceSchema = z.object({
  label: z.string().min(1),
  effects: EffectsSchema,
  sets: z.array(z.string().min(1)).optional(),
  result: z.string().min(1),
  later: z.string().min(1),
})

const CardSchema = z
  .object({
    id: z.string().min(1),
    requires: z.string().min(1).optional(),
    speaker: z.string().min(1),
    text: z.string().min(1),
    a: ChoiceSchema,
    b: ChoiceSchema,
  })
  .strict()

const ChapterSchema = z.object({
  title: z.string().min(1),
  cards: z.array(CardSchema).min(1),
})

const EndingSchema = z.object({
  if: z.string().min(1).optional(),
  text: z.string().min(1),
})

const StatsSchema = z.object({
  heart: z.number().int(),
  coin: z.number().int(),
  bonds: z.number().int(),
  spirit: z.number().int(),
})

export const WorldContentSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    role: z.string().min(1),
    tagline: z.string().min(1),
    statLabels: z.object({
      heart: z.string().min(1),
      coin: z.string().min(1),
      bonds: z.string().min(1),
      spirit: z.string().min(1),
    }),
    startStats: StatsSchema,
    facts: z.record(z.string(), z.string()),
    chapters: z.array(ChapterSchema).min(1),
    endings: z.array(EndingSchema).min(1),
  })
  .superRefine((world, ctx) => {
    const hasDefault = world.endings.some((ending) => ending.if === undefined)
    if (!hasDefault) {
      ctx.addIssue({
        code: 'custom',
        path: ['endings'],
        message: `World "${world.id}" has no default ending (an ending without "if" is required).`,
      })
    }
    for (const [chapterIndex, chapter] of world.chapters.entries()) {
      for (const [cardIndex, card] of chapter.cards.entries()) {
        if (!card.a || !card.b) {
          ctx.addIssue({
            code: 'custom',
            path: ['chapters', chapterIndex, 'cards', cardIndex],
            message: `Card "${card.id}" must have both choices a and b.`,
          })
        }
      }
    }
  })

export function parseWorldContent(raw: unknown, source: string): WorldContent {
  const result = WorldContentSchema.safeParse(raw)
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const path = issue.path.length ? issue.path.join('.') : '(root)'
        return `  - ${path}: ${issue.message}`
      })
      .join('\n')
    throw new Error(`Invalid world content in ${source}:\n${details}`)
  }
  return result.data
}

export { StatKeySchema }
