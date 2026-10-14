# 📝 Where all the text lives, and how to edit it

You do not need to know React to change the words on the site. Open the file, change the words between the quote marks, save. While `npm run dev` is running, the page updates by itself.

## ✅ The 4 rules

1. **Only change the words between the quote marks.** Do not delete the quote marks, commas or curly brackets around them.
2. **Apostrophes:** if the text has an apostrophe (like `I'm`), keep it inside **double** quotes: `"Hi, I'm Krishiv."`. If you use single quotes, write `\'` instead: `'Hi, I\'m Krishiv.'`
3. **Bold words:** put `**two stars**` around them, like `**click here**`. This works in `siteText.js` (landing page, menu, checker).
4. **Words in {curly brackets}** such as `{time}` or `{list}` are filled in by the page. Keep them in your sentence.

If the page goes blank after an edit, you probably deleted a quote mark or a comma. Undo the last change (Ctrl+Z or Cmd+Z) and try again.

---

## Landing page (`/`)  ->  `client/src/data/siteText.js`, the `landing` part

| What you see on the page | Name in the file |
| --- | --- |
| Small handwriting above the title ("is it safe to surf right now...") | `hero.tag` |
| The big title ("Can I Surf There?"). It sits on two lines: the last word goes on the second line | `hero.title` |
| Which title word is shown in a lighter aqua with the thin wavy underline | `hero.underlinedWord` (must match a word in the title exactly) |
| The line under the title ("Waves, wind, tide...") | `hero.subtitle` |
| "scroll down, the ocean is calling" | `hero.scrollHint` |
| The little "navigate site" note with the arrow by the wave button (a `\n` starts the second line) | `hero.navHint` |
| "okay, this is the part you came for" | `button.intro` |
| The words on the big button ("Can I Surf Here?") | `button.label` |
| "click here to check if you can actually surf here right now" | `button.help` |
| "psst... scroll down to see why I built this" | `button.scrollNote` |
| About me: small note, heading and the long text | `story.note`, `story.title`, `story.body` (a blank line `\n\n` inside it starts a new paragraph, and the text is split into 3 paragraphs right now) |
| The postcard: title, coordinates, little stamp | `story.postcardTitle`, `story.postcardCoords`, `story.postcardStamp` |
| Field guide prompt: note, heading, paragraph, button | `guidePrompt.note`, `.title`, `.text`, `.button`. In the heading, the words between `**stars**` get a soft aqua glow (the rest of the heading has almost none) |
| The T&C: heading and two paragraphs | `terms.title`, `terms.paragraph1`, `terms.paragraph2` |
| The navy fine print at the very bottom (2 lines) | `terms.finePrint1`, `terms.finePrint2` |

Example. To change the button words, find:

```js
label: 'Can I Surf Here?',
```

and change it to, for example:

```js
label: 'Is It Surfable?',
```

## The wave menu (top right of every page)  ->  `siteText.js`, the `menu` part

Four links, in this order: Home, Surf Checker, Surf Field Guide, T&C. Each has a `label` (the big word) and a `note` (the small line under it). A `note` can be empty (`''`), like the T&C one, and then no small line shows. Keep them in that order, because the first one always goes to Home, the second to the checker, and so on. `buttonLabel` is only read aloud by screen readers.

## Surf Checker (`/check`)

**Fixed words around the meter**  ->  `siteText.js`, the `checker` part

| What you see | Name in the file |
| --- | --- |
| Top-left link ("CanISurfThere") | `backLink` |
| Refresh button, and its busy version ("Checking...") | `refresh`, `refreshing` |
| "Reading the ocean..." while it loads | `loadingReport` |
| The words at each end of the meter ("Avoid" and "Ideal") | `meterEnds.low`, `meterEnds.high` |
| "What to wear:" | `wetsuitLabel` |
| "What is holding the score down" | `watchOutsTitle` |
| "Updated 1:00 PM, beach time..." | `updated` (keep `{time}`) |
| The "Could not load..." note | `missing` (keep `{list}`), `sourceNames` |
| The grey estimate disclaimer at the bottom | `disclaimer` |
| "New to surfing? Read the Surf Field Guide..." | `guideBefore`, `guideLink`, `guideAfter` |
| The two headings inside the beach dropdown | `beachGroups.yours`, `beachGroups.popular` |
| Error messages | `serverDown`, `tryAgain` |

**Beach names, cities and states**  ->  `server/beaches.js`  
Each beach has `name`, `city` and `state`. Change those, save, and the dropdown updates (the server restarts by itself). Do not change `id`.

**The words that come from the calculator**  ->  `server/safety.js`  
These are written by the server, because they depend on the live numbers:

| What you see | Where in `server/safety.js` |
| --- | --- |
| The rating word and the sentence next to the meter ("Ideal", "Good", "Use caution", "Poor", "Avoid" and their sentences) | the function `labelFor` |
| "What to wear" suggestions (boardshorts, 3/2 mm wetsuit...) | the function `wetsuitFor` |
| The 12 card titles ("Wave height", "Wind", "Tide"...) and the sentences on each card | the `makeFactor('...')` lines. The first piece in quotes is the id (do not change it), the second is the **title**, and the sentence is the **detail** |
| Rip current level words | the `levels` list in the "rip current risk" part |
| Weather words ("Clear sky", "Thunderstorm"...) | the `weatherCodes` list near the top |

Tip: use Find (Ctrl+F or Cmd+F) in the file and search for a few words you can see on the page, like `Wave height` or `Lightning risk`.

**Server error messages**  ->  `server/index.js`: search for `error:`.

## Surf Field Guide (`/learn`)

**Almost everything**  ->  `client/src/data/learnContent.js`

| What you see | Name in the file |
| --- | --- |
| The table of contents names on the left | `sections` (the `label` of each) |
| Each chapter: its title, handwritten note, intro, the cards, and the "how the meter treats it" box | `chapters`, then the chapter name (`waves`, `wind`, `tide`, `rips`, `temp`, `sky`, `lineup`): `title`, `note`, `intro`, `points`, `meter` |
| The wetsuit table | `chapters.temp.table` |
| The three La Jolla cards | `localBreaks` |
| The beach flags | `flags` |
| The Do and Don't lists | `dos`, `donts` |
| The "before you paddle out" checklist | `checklist` |
| The "if something goes wrong" steps | `emergency` |
| The words sliding across the dark strip | `marqueeWords` |

Inside any intro text, put `==double equals==` around words to get the blue highlighter pen effect.

**A few words are inside `client/src/pages/Learn.jsx`.** Use Find and search for the words you see:

| What you see | Search for |
| --- | --- |
| "a field guide by krishiv" | `a field guide by` |
| The big title "The Surf Field Guide" | `Field Guide</em>` (the italic part is inside `<em>`) |
| The sentence under it | `What the numbers on the meter mean` |
| "scroll to start reading" | `scroll to start reading` |
| "In this guide" (above the table of contents) | `In this guide` |
| "Check the surf" (top right link) | `Check the surf` |
| The "All set..." message after you tick the whole checklist | `All set. Have a great surf session` |
| The last section: note, heading, button | `alright now go check`, `Ready to see if today`, `Open the surf checker` |
| The footer notice and copyright | `This guide is general education`, `2026 Krishiv Chhabria` |

## The browser tab and search engines  ->  `client/index.html`

The tab title is inside `<title>...</title>` and the short description is in `<meta name="description" content="...">`.

## The copyright line

It appears in three places. Change all three if you edit it:

1. `siteText.js` -> `terms.finePrint1` (landing page, bottom)
2. `client/src/pages/Learn.jsx` -> search `2026 Krishiv Chhabria` (field guide footer)
3. `README.md` (the "Copyright" part) and `LICENSE`

An email address written in the text (like `krchhabria@ucsd.edu`) automatically becomes a clickable link.

## Changing a word everywhere (like the site name)

Use your editor's "Find in files" (Ctrl+Shift+F or Cmd+Shift+F in VS Code). Search for the word, check each result, and replace the ones you want.

## What is NOT text you can change

The look of the words (font, size, color) is in the CSS files in `client/src/styles/`, not in the text files. The **title font** (right now Yellowtail) is `--font-title` in `global.css`. It is used for the big title and for the "Want to learn how to ride a wave too?" heading. The title size, tilt, letter spacing and glow are in `.hero-title` and that heading is `.guide-heading`, both in `landing.css`. All the other titles, buttons and numbers use `--font-display` (right now Fredoka).

## switching the menu style
open `client/src/data/siteText.js` and find `navStyle`. set it to `'bar'` for the navigation bar across the top, or `'wave'` for the round wave button in the top right. the bar's name on the left is `menu.brand`, and the link names are the same `menu.links` used by the wave menu.
