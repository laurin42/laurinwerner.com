import { describe, expect, it } from "vitest";
import { formatMonth, formatPeriod } from "@/lib/format";

describe("formatMonth", () => {
  it("formats a month in each language", () => {
    expect(formatMonth("2024-07", "de")).toBe("Juli 2024");
    expect(formatMonth("2024-07", "en")).toBe("July 2024");
  });
});

describe("formatPeriod", () => {
  it("formats a range", () => {
    expect(formatPeriod("2024-07", "2025-03", "de", "heute")).toBe(
      "Juli 2024 – März 2025",
    );
  });

  it("uses the present label for ongoing entries", () => {
    expect(formatPeriod("2025-03", null, "en", "present")).toBe(
      "March 2025 – present",
    );
  });

  it("shows a single month when start and end match", () => {
    expect(formatPeriod("2024-05", "2024-05", "de", "heute")).toBe("Mai 2024");
  });
});
