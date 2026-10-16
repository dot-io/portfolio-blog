// A post's `pubDate` may be a bare date (2026-10-16) or a full timestamp with
// its UTC offset (2026-10-16T14:30:00+02:00). The full value orders posts;
// only the calendar day is ever shown.

// Days are read in this zone, so a post written at 00:30 Brussels time is not
// shown as the previous day just because that instant is still yesterday in UTC.
const SITE_TIME_ZONE = "Europe/Brussels";

export const toDate = (value: string | Date) => new Date(value);

// sv-SE is the locale whose short date format is ISO: YYYY-MM-DD
export const formatDay = (value: string | Date) =>
  toDate(value).toLocaleDateString("sv-SE", { timeZone: SITE_TIME_ZONE });

// for <time datetime>, where the exact instant belongs
export const toISO = (value: string | Date) => toDate(value).toISOString();

export const newestFirst = (a: string | Date, b: string | Date) =>
  toDate(b).valueOf() - toDate(a).valueOf();
