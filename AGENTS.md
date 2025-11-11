# Encoding guardrails for Codex runs

## What went wrong
- Editing `components/detail/Rio25PreviewDetail.tsx` via ad-hoc scripts introduced mojibake: I replaced strings like `funções` → `funcoes`, `destilação` → `distilacao`.
- Root cause: I avoided non-ASCII characters while scripting in PowerShell, assuming it would prevent encoding errors, but the file already mixes UTF-8 text. Stripping diacritics regresses copy quality.

## How to avoid it next time
1. **Prefer `apply_patch` for textual edits** – it preserves UTF-8 literals already in the file. When using `python` helpers, keep the source file encoded as UTF-8 and include diacritics directly or via `\uXXXX`.
2. **Assume UTF-8 everywhere** – before writing, confirm commands default to UTF-8 (e.g., `chcp 65001` in PowerShell if needed) and always pass `encoding='utf-8'` to `Path.read_text` / `write_text`.
3. **Diff for mojibake before finalizing** – run `rg -n "[\\x80-\\xFF]" file` or review sections with Portuguese text to ensure accents remain intact.
4. **Document fixes promptly** – if an encoding slip happens, repair the affected strings immediately and note it in the summary so users can verify easily.
