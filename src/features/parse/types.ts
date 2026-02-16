import { ParsedComponents } from 'chrono-node'

export interface ChronoObj {
  parsedText: string | undefined
  parsedStartObject: ParsedComponents | undefined
  parsedEndObject: ParsedComponents | undefined
}
