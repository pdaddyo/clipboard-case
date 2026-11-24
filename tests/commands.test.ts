import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@raycast/api", () => ({
  Clipboard: {
    readText: vi.fn(),
    paste: vi.fn(),
  },
  showHUD: vi.fn(),
}));

import { Clipboard, showHUD } from "@raycast/api";
import pasteLowercase from "../src/paste-lowercase";
import pasteUppercase from "../src/paste-uppercase";
import pasteSentenceCase from "../src/paste-sentence-case";
import pasteTitleCase from "../src/paste-title-case";

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(Clipboard.paste).mockResolvedValue(undefined);
  vi.mocked(showHUD).mockResolvedValue(undefined);
});

describe("clipboard commands", () => {
  it.each([
    ["lowercase", pasteLowercase, "hello world. next sentence!"],
    ["uppercase", pasteUppercase, "HELLO WORLD. NEXT SENTENCE!"],
    ["sentence case", pasteSentenceCase, "Hello world. Next sentence!"],
    ["title case", pasteTitleCase, "Hello World. Next Sentence!"],
  ] as const)("reads the current clipboard once and pastes %s once", async (_name, command, expected) => {
    vi.mocked(Clipboard.readText).mockResolvedValue("hELLO WORLD. NEXT SENTENCE!");
    await command();
    expect(Clipboard.readText).toHaveBeenCalledExactlyOnceWith();
    expect(Clipboard.paste).toHaveBeenCalledExactlyOnceWith(expected);
    expect(showHUD).not.toHaveBeenCalled();
  });

  it.each([undefined, ""])("does not paste when the clipboard is empty or non-text (%s)", async (text) => {
    vi.mocked(Clipboard.readText).mockResolvedValue(text);
    await pasteLowercase();
    expect(Clipboard.paste).not.toHaveBeenCalled();
    expect(showHUD).toHaveBeenCalledWith("No text on the clipboard. Copy some text first.");
  });

  it("preserves whitespace-only clipboard text", async () => {
    vi.mocked(Clipboard.readText).mockResolvedValue(" \t\n");
    await pasteLowercase();
    expect(Clipboard.paste).toHaveBeenCalledWith(" \t\n");
  });

  it("reports a clipboard-read failure without trying to paste", async () => {
    vi.mocked(Clipboard.readText).mockRejectedValue(new Error("Private clipboard detail"));
    await pasteLowercase();
    expect(Clipboard.paste).not.toHaveBeenCalled();
    expect(showHUD).toHaveBeenCalledWith("Could not read clipboard text. Try copying it again.");
  });

  it("reports a paste failure without exposing clipboard text or retrying", async () => {
    vi.mocked(Clipboard.readText).mockResolvedValue("PRIVATE TEXT");
    vi.mocked(Clipboard.paste).mockRejectedValue(new Error("PRIVATE TEXT"));
    await pasteLowercase();
    expect(Clipboard.paste).toHaveBeenCalledTimes(1);
    expect(showHUD).toHaveBeenCalledWith(
      "Could not paste. Focus a text field and check Raycast’s Accessibility permission.",
    );
  });
});
