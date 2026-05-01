import { describe, it, expect } from "vitest";
import { postsRouter } from "./posts";

describe("posts router", () => {
  it("should have posts router defined", () => {
    expect(postsRouter).toBeDefined();
  });

  it("should have getAll query procedure", () => {
    expect(postsRouter._def.procedures.getAll).toBeDefined();
  });

  it("should have getById query procedure", () => {
    expect(postsRouter._def.procedures.getById).toBeDefined();
  });

  it("should have search query procedure", () => {
    expect(postsRouter._def.procedures.search).toBeDefined();
  });

  it("should have publish mutation procedure", () => {
    expect(postsRouter._def.procedures.publish).toBeDefined();
  });

  it("posts router should be a valid router", () => {
    const procedures = Object.keys(postsRouter._def.procedures);
    expect(procedures).toContain("getAll");
    expect(procedures).toContain("getById");
    expect(procedures).toContain("search");
    expect(procedures).toContain("publish");
  });
});
