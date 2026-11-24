# Clipboard Case

A small Raycast extension: copy text, run a command, and paste it in the case you want.

| Command                    | Clipboard                   | Pasted text                 |
| -------------------------- | --------------------------- | --------------------------- |
| **Paste as Lowercase**     | `HELLO World`               | `hello world`               |
| **Paste as Uppercase**     | `Hello world`               | `HELLO WORLD`               |
| **Paste as Sentence Case** | `HELLO WORLD. HOW ARE YOU?` | `Hello world. How are you?` |
| **Paste as Title Case**    | `the quick brown fox`       | `The Quick Brown Fox`       |

## Install locally

Requires macOS, Raycast 2.13.1 or later, and Node.js 22.22.2 or later.

```sh
git clone https://github.com/pdaddyo/clipboard-case.git
cd clipboard-case
npm ci
npm run dev
```

Raycast imports the extension automatically. Once the first build finishes, you can stop the development process with `Ctrl+C`; the commands remain installed. Run `npm run dev` again after changing the code.

If you already have the source, run the last two commands inside its folder.

This repository is open source; the extension is not published in the Raycast Store.

## Use

1. Copy some text.
2. Put your cursor where you want it pasted.
3. Open Raycast and run **Paste as Lowercase** (or another case command).

For quick access, open **Raycast Settings → Extensions → Clipboard Case** and assign **Paste as Lowercase** a hotkey, such as `⌃⌥⌘V`, or an alias like `lc`. Choose an unused shortcut. With a hotkey, you can paste directly without opening Raycast first.

If pasting does not work, focus an editable field and check **System Settings → Privacy & Security → Accessibility → Raycast**.

## Behavior

- Reads the current clipboard only when you run a command, then uses Raycast's native paste API. It does not intercept ordinary `⌘V`.
- Pastes plain text. Spaces, tabs, punctuation, and line breaks are retained; rich-text styling is discarded.
- Empty or non-text clipboards show a short message instead of pasting.
- All conversion runs locally. The extension has no network calls, AI, analytics, or clipboard logging. Raycast's own clipboard-history settings still apply.
- Lowercase and uppercase use JavaScript's standard Unicode case conversion. Some letters can expand into multiple characters, such as `ß` → `SS`.
- Title case capitalizes every word, including small words such as “the” and “of”. Apostrophes stay inside words (`DON'T` → `Don't`), and hyphenated parts are capitalized (`well-known` → `Well-Known`). It does not implement a particular editorial style guide.
- Sentence case lowercases the text, then capitalizes the first letter, the start of each line, and the first letter after `.`, `!`, or `?` followed by whitespace. It handles surrounding quotes, but does not identify proper names, acronyms, or abbreviations. For example, `NASA` becomes `Nasa` at the start of a sentence and `nasa` elsewhere.

## Development

```sh
npm run check   # Type checking, tests, Raycast lint, and a local build
npm run dev     # Import into Raycast and watch for changes
npm run bundle  # Create a local .rayext archive
```

The shared clipboard flow is in `src/paste.ts`; the pure conversions are in `src/transforms.ts`. Each command has a small entry point so it can have its own hotkey.

The tests cover Unicode, punctuation, whitespace, command wiring, empty clipboards, and read/paste failures. They mock the Raycast API; actual pasting requires Raycast and an editable destination.

Possible small additions later: **trim surrounding whitespace**, **paste on one line**, and **snake_case / kebab-case**.

API reference: [Raycast Clipboard API](https://developers.raycast.com/api-reference/clipboard), [local development](https://developers.raycast.com/basics/create-your-first-extension).

## License

MIT — see [LICENSE](LICENSE).
