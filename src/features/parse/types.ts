import { ParsedComponents } from "chrono-node";

export type ChronoObj = {
  parsedText: string | undefined;
  parsedStartObject: ParsedComponents | undefined;
  parsedEndObject: ParsedComponents | undefined;
};
