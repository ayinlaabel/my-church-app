/**
 * Time utilities: convert minutes to other units and format durations.
 */

import { IReport } from "@declared-types/index";

export type TimeUnit = "minutes" | "hours" | "days" | "weeks" | "auto";

/**
 * Convert minutes to the requested time unit.
 * - `auto` picks the largest reasonable unit (weeks, days, hours, minutes).
 *
 * Examples:
 * ```ts
 * convertMinutes(90, 'hours') // 1.5
 * convertMinutes(90, 'auto') // 1.5 (hours)
 * ```
 */
export function convertMinutes(value: number, unit: TimeUnit = "auto"): number {
  if (!Number.isFinite(value)) return NaN;
  const abs = value;
  switch (unit) {
    case "minutes":
      return abs;
    case "hours":
      return abs / 60;
    case "days":
      return abs / (60 * 24);
    case "weeks":
      return abs / (60 * 24 * 7);
    case "auto": {
      if (Math.abs(abs) >= 60 * 24 * 7) return abs / (60 * 24 * 7);
      if (Math.abs(abs) >= 60 * 24) return abs / (60 * 24);
      if (Math.abs(abs) >= 60) return abs / 60;
      return abs;
    }
    default:
      return NaN;
  }
}

/**
 * Format minutes into a human-readable string.
 *
 * Options:
 * - `short`: use short unit labels (e.g. `1w 2d 3h 4m`).
 * - `maxUnits`: limit number of units shown (e.g. 1 => `1w`).
 *
 * Examples:
 * ```ts
 * formatDuration(1500) // "1 day 1 hour"
 * formatDuration(1500, { short: true }) // "1d 1h"
 * ```
 */
export function formatDuration(
  minutes: number,
  opts?: { short?: boolean; maxUnits?: number },
): string {
  if (!Number.isFinite(minutes)) return String(minutes);
  const sign = minutes < 0 ? "-" : "";
  let rem = Math.abs(Math.floor(minutes));

  const W = 60 * 24 * 7;
  const D = 60 * 24;
  const H = 60;

  const weeks = Math.floor(rem / W);
  rem = rem % W;
  const days = Math.floor(rem / D);
  rem = rem % D;
  const hours = Math.floor(rem / H);
  const mins = rem % H;

  const parts: string[] = [];
  const short = !!opts?.short;

  if (weeks)
    parts.push(
      short ? `${weeks}w` : `${weeks} ${weeks === 1 ? "week" : "weeks"}`,
    );
  if (days)
    parts.push(short ? `${days}d` : `${days} ${days === 1 ? "day" : "days"}`);
  if (hours)
    parts.push(
      short ? `${hours}h` : `${hours} ${hours === 1 ? "hour" : "hours"}`,
    );
  if (mins || parts.length === 0)
    parts.push(
      short ? `${mins}m` : `${mins} ${mins === 1 ? "minute" : "minutes"}`,
    );

  if (opts?.maxUnits && parts.length > opts.maxUnits) {
    return sign + parts.slice(0, opts.maxUnits).join(" ");
  }

  return sign + parts.join(" ");
}
export const groupReportByDay = (
  transactions: IReport[],
): Record<string, IReport[]> => {
  // 1. Create a shallow copy to avoid mutating the original array, then sort descending
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.holdOn).getTime() - new Date(a.holdOn).getTime();
  });

  // 2. Group the newly sorted array

  return sortedTransactions.reduce((groups: Record<string, IReport[]>, tx) => {
    const monthYear = tx.holdOn.substring(0, 7); // Returns "2026-09"
    if (!groups[monthYear]) groups[monthYear] = [];
    groups[monthYear].push(tx);
    return groups;
  }, {});
};

export const isCurrentMonthAndYear = (date: string) => {
  const inputDate = new Date(date);
  const now = new Date();

  return (
    inputDate.getMonth() === now.getMonth() &&
    inputDate.getFullYear() === now.getFullYear()
  );
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
export const formatMonthYearDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const formatToAMPM = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${hours}:${minutes} ${ampm}`;
};

export default {
  convertMinutes,
  formatDuration,
  groupReportByDay,
  formatDate,
  formatToAMPM,
  formatMonthYearDate,
};
