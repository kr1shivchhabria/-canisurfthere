# 🎨 CanISurfThere design system

Written in the style of awesome-design-md: one file that says how the site looks, so anyone (or any AI) can change things without breaking the feel.

## 💭 Idea

Stand on the beach and look down from above: deep water, flowing swells, white foam, wet sand, dry sand. The site is that picture. The landing page is **playful and illustrated**. The checker is **bright and friendly**. The field guide is **calm and editorial**, like a printed zine. Same palette, three personalities.

## 🖍️ Palette

| Name | Hex | Used for |
| --- | --- | --- |
| Sky | `#4fb4ea` | the main accent: water, button, highlights |
| Sky pale | `#d8effc` | panels and borders on the checker |
| Ocean | `#0b4a75` | icons, hover states |
| Deep | `#072f4d` | outlines, button edges, dark text |
| Navy | `#0b2a5c` | fine print, field guide ink |
| Foam | `#ffffff` | title letters, foam |
| Sand | `#ecd9ad` | the beach, accents |
| Sand dark | `#c9a96b` | shadows on sand |
| Coral | `#ef6f5e` | tiny pops: crabs, notes, "don't" |
| Sun | `#f6c84c` | tiny pops: beach balls, buckets |
| Paper | `#f7f1e3` | field guide background |

The meter itself runs red to green because that is what it means. Nothing else uses red and green as decoration.

## 🔤 Type

- **Yellowtail** (`--font-title`): a retro surf-shop script for the big landing title and the "Want to learn how to ride a wave too?" heading. It has one weight, so it uses `--font-weight-title` (400). A fake bold looks smudgy. Its letters are joined, so the title animates word by word, never letter by letter.
- **Fredoka** (`--font-display`, weight 700): friendly, rounded and very legible. All other titles, the big button, headings, the wave menu and the numbers on the checker.
- **Caveat Brush** (`--font-note`): bold handwriting for notes, prompts and arrows on the landing page and checker. Always lowercase and chatty.
- **Nunito** (600 to 800): body text.
- **Fraunces** and **Gochi Hand**: used only on the field guide page, which keeps its own look.

### The two big headings

The landing title and the field guide prompt heading are big white script with wide letter spacing. The title is tilted a few degrees and has only a faint aqua glow, with the word "Surf" in a lighter aqua and a thin wavy underline that draws itself. The prompt heading has almost no glow, except the words between `**stars**` in `siteText.js` ("learn how to ride a wave"), which glow softly in aqua. No yellow or gold is used in either.

## 🔷 Shapes and depth

- Landing: stickers. Thick dark blue outlines, hard bottom edges, glossy highlights.
- Checker: soft pale blue glass panels with a sand edge on the main card.
- Field guide: printed cards. Navy borders, hard offset shadows in sand or sky, corners that are half sharp and half round.

## The ocean

The wave menu button (top right of every page) is a small sky blue sticker that opens a sand-colored panel with four links.

`OceanCanvas.jsx` draws layered swells that travel toward the shore, with foam on each crest, a lacy dashed line, glints of light, and (on the landing page) a shoreline with wet sand and a sheet of water running up the beach. Scrolling pushes the swells toward the shore faster. It pauses when off screen and shows one still frame for people who prefer reduced motion.

## Motion rules

- Landing hero: the title words glide up and fade in once, one after another. Waves flow all the time and soft sunbeams drift across the water.
- Bubbles (`Bubbles.jsx`): a quick, dense burst that rises out of the water and pops in the thin band where the sand fades into the water, just above the field guide prompt. They are short lived and never hang around on the open water.
- Landing sand screen: decorations pop in once, then idle (crab scuttles and snaps, ball bounces, flag flutters). They drift with the mouse by depth.
- The landing page is one continuous beach: long ocean, shoreline, long sand (button, story), then a patch of ocean for the field guide prompt (the sand fades into it, and a little surfer rides across), then sand again for the T&C.
- Only the field guide prompt is "pinned" (sticky) for a moment, so scrolling holds for a second while the surfer rides by. The about me has no scroll hold and no text animation, but it is surrounded by beach decorations.
- Field guide: progress bar, drawing diagrams, cards that rise, a highlighter pen, a marquee that speeds up when you scroll fast.
- Everything respects `prefers-reduced-motion`.

## Voice

Friendly, direct, a little playful. Handwriting is lowercase. Safety text is plain and never jokes about risk. Every page says the data is an estimate.
