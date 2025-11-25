export interface HeroDate {
  calendar: { identifier: string };
  era: string;
  year: number;
  month: number;
  day: number;
}

// Used to convert HeroUI date format to JS Date
export const formatHeroDate = (d: HeroDate | null): Date | null => {
  if (!d) return null;
  return new Date(d.year, d.month - 1, d.day);
};
