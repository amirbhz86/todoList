import { getInputTextAlign, getTextAlignForLanguage } from "../textAlign";

describe("getTextAlignForLanguage", () => {
  it("returns right for Persian", () => {
    expect(getTextAlignForLanguage("fa")).toBe("right");
  });

  it("returns left for English", () => {
    expect(getTextAlignForLanguage("en")).toBe("left");
  });
});

describe("getInputTextAlign", () => {
  it("returns left when RTL (Persian)", () => {
    expect(getInputTextAlign(true)).toBe("right");
  });

  it("returns right when LTR (English)", () => {
    expect(getInputTextAlign(false)).toBe("left");
  });
});
