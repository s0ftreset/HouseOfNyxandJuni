# Elyndor — The Living Archive

An original fantasy lore website for the House of Nyx & Juni. A responsive static site with a searchable archive, category filters, alphabetical sorting, pagination, and shareable lore entries.

## Publish with GitHub Pages

In this repository, open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**. Then open **Actions → Publish Elyndor → Run workflow**. Later pushes to `main` deploy automatically.

Expected address after a successful deployment: https://s0ftreset.github.io/HouseOfNyxandJuni/

## Edit the lore

Edit `lore.js`. Each entry has a unique permanent `id`, a `name`, a `category`, a `body`, and a `source`. Preserve IDs to keep shared links working. Categories: Characters, Places, Houses, Magic, Customs, Chronicles, Aerie & Dragons. New entries appear automatically in search and category filters. Paragraphs in the body are separated by `\n\n`.

This first edition contains 97 reader-facing entries from `Elyndor_Master_Lorebook_with_Valandir_CASCADE_SAFE.json` (30 September 2026) and the Caer Avar master outline (4 October 2026). Source lorebooks are not included in this public repository. Hidden master entries, roleplay placeholders, and explicit character preference fields were excluded. Older Astreth entries were held back pending reconciliation with the later Astereth spelling. The display title for Lady Virelle Caith follows the spelling in her source description. Provisional Aerie details retain their original qualifications. Dorm life, later rider ranks, and other subsequent additions are not yet part of these source files.

## Development

No install or build is required. Open `index.html` directly or serve this folder with `python3 -m http.server 8000`. All local assets use relative paths for GitHub project Pages. Google Fonts is optional; serif and sans-serif fallbacks work offline. Entry bodies are rendered as text, never as HTML.

`style.css` controls the visual design. `landscape.svg` is an original decorative illustration, not a geographic map or canonical depiction of a named fortress. `crest.svg` is a decorative site emblem, not a noble-house crest.

## Content ownership

Elyndor lore belongs to its creators. No license to reuse the lore or character material is granted by this repository.
