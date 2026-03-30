import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("Health Check API", () => {
  it("returns healthy status", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
  });
});
