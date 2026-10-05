# Elyndor — The Living Archive

An original fantasy lore website for the House of Nyx & Juni. A responsive static site with a searchable archive, category filters, alphabetical sorting, pagination, and shareable lore entries.

## Publish with GitHub Pages

In this repository, open **Settings → Pages → Build and deployment → Source**, and select **GitHub Actions**. Then open **Actions → Publish Elyndor → Run workflow**. Later pushes to `main` deploy automatically.

Expected address after a successful deployment: https://s0ftreset.github.io/HouseOfNyxandJuni/

## Edit the lore

Edit `lore.js`. Each entry has a unique permanent `id`, a `name`, a `category`, a `body`, and a `source`. Preserve IDs to keep shared links working. Categories: Characters, Places, Houses, Magic, Customs, Chronicles, Aerie & Dragons. New entries appear automatically in search and category filters. Paragraphs in the body are separated by `\n\n`.

The archive contains 104 reader-facing entries. The current source is the full Elyndor master lorebook supplied on 4 October 2026, supplemented by the 18 Caer Avar outline entries retained from the previous edition. Source lorebooks are not included in this public repository. Hidden entries, roleplay placeholders, and explicit character preference fields are excluded, with a reader-facing Koenig Till profile using only the public portion before the secret. Diana's references to the roleplay user are rendered as the established Paramour. Astreth follows the spelling in the current supplied lorebook and artwork. The display title for Lady Virelle Caith follows the spelling in her source description. Provisional Aerie details retain their original qualifications.

## Character and location galleries

`media.js` connects artwork to lore. Put new images in `images/`, then add a media record with a unique `id`, the matching lore `entryId`, `kind` (`character` or `location`), title, subtitle, relative `src`, intrinsic width/height, descriptive `alt`, and caption. It will appear in the relevant homepage gallery and its lore entry. Multiple images can share an entry ID. Full-size viewing supports Escape, previous/next buttons, and arrow keys; portraits and artwork are not cropped.

Artwork: Rhaevor Veyr, Valandir Merythil, Astreth Veyre, Koenig Till, Lady Diana Aurelune, and High Lord Vaelric Draven, plus the Elyndor Twilight City of Waterfalls illustration. The four latest character images were supplied specifically for the gallery update. Other entries remain text-only until matching artwork is added. `galleries.css` contains gallery and image-viewer styling.

## Development

No install or build is required. Open `index.html` directly or serve this folder with `python3 -m http.server 8000`. All local assets use relative paths for GitHub project Pages. Google Fonts is optional; serif and sans-serif fallbacks work offline. Entry bodies are rendered as text, never as HTML.

`style.css` controls the visual design. `castle-dusk.webp` is a generated, painted medieval castle landscape, used as decorative website artwork rather than a canonical depiction of a named fortress. The original `landscape.svg` is retained as an earlier decorative illustration. `ornament.svg` supplies manuscript-style border flourishes. The design uses aged parchment, oxblood, antique gold, display capitals, and readable book typography. `crest.svg` is a decorative site emblem, not a noble-house crest.

## Content ownership

Elyndor lore belongs to its creators. No license to reuse the lore or character material is granted by this repository.


## Portrait hall, chat links, and secret room

The homepage has a compact Faces of Elyndor link; `#characters` opens the dedicated portrait hall. Each character media record has a `chatUrl` pointing to the supplied DreamJourney creation. Chat Here appears both in the gallery and the lore reader and opens a new tab.

The small footer seal opens `#secrets`; typing THORNS outside a text field is an alternate entrance. The Sealed Archive has an outer spoiler warning and individual expandable records, following the two-layer Foxglove pattern. Add spoiler records to `secrets.js` as `{id, title, body}`. The room starts empty for deliberate author selection. Secret records are excluded from normal archive search. This is a public Easter egg, not authentication; source and content remain publicly accessible. Do not store private data here.


## Caer Avar update · 4 October 2026

`#caer-avar` opens the dedicated illustrated chapter. The supplied current Caer Avar JSON replaces the earlier 18-entry outline; legacy `aerie-0` through `aerie-17` links resolve to current subject records. Public records retain provisional wording and remove DJAI trigger underscores. Hidden records remain unpublished; Brenn has a public portrait/profile with hidden parentage omitted. Related public descriptions omit references revealing Tavian's hidden manifestation. No new secret-room files were added. The uploaded Caitlin portrait was confirmed by the author as Calista Daine and is published with her lore.

Eight new artworks preserve their full composition: academy map, Brenn, Dacian, Ilyra, Gunnar, Sorrel, Calista, and the trio. Existing character chat links are retained; no chat addresses were supplied for the new characters.
