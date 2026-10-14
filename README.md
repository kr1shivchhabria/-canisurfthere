<h1 align="center">CanISurfThere</h1>

<p align="center">
  A surf safety meter for the beach you're standing at.<br>
  Pick a beach, hit refresh, get a score from Avoid to Ideal.
</p>

<p align="center">
  <a href="#run-it">Run it</a> &nbsp;·&nbsp;
  <a href="#how-the-score-works">The score</a> &nbsp;·&nbsp;
  <a href="#edit-it">Edit it</a> &nbsp;·&nbsp;
  <a href="#credits">Credits</a>
</p>

<br>

---

<br>

## About

I'm an international CS student at UC San Diego. When I got to SoCal I fell in love with the beaches and surfing, but I never knew when it was actually safe to go out. So I built a site that tells me.

It covers three beaches in La Jolla (Windansea, Black's Beach and La Jolla Shores) and ten popular beaches around the US. The score uses live waves, wind, tide, temperature, sky, daylight and official weather alerts.

The site has three parts:

- **Landing page:** a long scroll from ocean to sand, ending at the big **Can I Surf Here?** button.
- **Surf checker:** pick a beach and see the meter with a card for each condition.
- **Surf field guide:** how to read waves, spot a rip current, and when to stay out of the water.

> **Disclaimer**
> This is a student project. The score is an estimate from public data. It does not replace lifeguards, posted flags or your own judgment. If you're unsure, stay out of the water.

<br>

---

<br>

## Run it

> You can edit this section any time. It's plain text, so add your own steps or notes.

You need internet (the ocean data comes from free public websites) and about 5 minutes the first time.

### Quick version

If you already have Node.js 18.11 or newer:

```bash
npm run install-all
npm run dev
```

Then open http://localhost:5173.

### Step by step

**1. Install Node.js (one time)**

Go to https://nodejs.org, download the **LTS** version and install it. Then close your terminal completely and open a new one. Check that it worked:

```bash
node -v
npm -v
```

Both should print a version number. You need Node 18.11 or newer (20 or newer is best).

**2. Get the project**

With git:

```bash
git clone https://github.com/YOUR-USERNAME/canisurfthere.git
```

Without git: click the green **Code** button on the GitHub page, choose **Download ZIP**, and unzip it.

**3. Open a terminal in the project folder**

- **Mac:** open Terminal, type `cd ` (c, d, space), drag the `canisurfthere` folder from Finder into the window, and press Enter.
- **Windows:** open the `canisurfthere` folder in File Explorer, click the address bar, type `cmd` and press Enter.

To check you're in the right place, type `ls` (Mac) or `dir` (Windows). You should see `package.json`, `client` and `server`.

**4. Install everything (one time, 1 to 3 minutes)**

```bash
npm run install-all
```

**5. Start the site**

```bash
npm run dev
```

Wait for a line that says `http://localhost:5173`, then open it in your browser. Click **Can I Surf Here?** to open the checker, and use the wave button in the top right to move between pages.

**Next time**, you only need:

```bash
cd path/to/canisurfthere
npm run dev
```

Press **Control + C** in the terminal to stop it.

### If something goes wrong

| Problem | Fix |
| --- | --- |
| `command not found: npm` or `'npm' is not recognized` | Node.js isn't installed, or the terminal wasn't reopened after installing. Redo step 1. |
| `Port 5173 is already in use` | Another copy is still running. Close other terminal windows and try again. |
| Red errors during `npm run install-all` | Check `node -v` is 18.11 or newer, delete the `node_modules` folders, and run it again. |
| The page can't reach the server | Run `npm run dev` from the main project folder, not from `client`. |
| Cards say "No data" | One of the public data sources didn't answer. Press **Refresh** in a few seconds. |
| Fonts look different | Fonts load from Google Fonts, so they need internet. |

### Production build

```bash
npm run install-all
npm run build
npm start
```

Then open http://localhost:3001. The Node server serves the built site and the data together.

<br>

---

<br>

## How the score works

1. Every condition gets its own score from 0 to 100: wave height, wave period, wind, gusts, tide, water temperature, air temperature, UV, visibility, sky, rip current risk and daylight.
2. Each one has a weight. Waves count for more than UV.
3. The final score is the weighted average.
4. Dangerous things pull the score down on their own: huge waves, storms, darkness, strong wind, high rip risk and official warnings. One bad condition can't hide behind good ones.
5. If key data is missing, the score is capped so it never says Ideal without checking everything.

| Score | Label |
| --- | --- |
| 85 and up | Ideal |
| 70 to 84 | Good |
| 50 to 69 | Use caution |
| 30 to 49 | Poor |
| Under 30 | Avoid |

At night the score drops, and the checker shows a warning saying why.

### Data sources

All free, no keys needed.

| Source | Used for |
| --- | --- |
| [Open-Meteo Marine](https://open-meteo.com/en/docs/marine-weather-api) | Waves and swell |
| [Open-Meteo Weather](https://open-meteo.com/en/docs) | Wind, temperature, UV, visibility, sunrise and sunset |
| [NOAA CO-OPS](https://api.tidesandcurrents.noaa.gov/api/prod/) | Tides and water temperature |
| [National Weather Service](https://www.weather.gov/documentation/services-web-api) | Rip current and high surf alerts |

Open-Meteo is free for non-commercial use. weather.gov asks apps to identify themselves, so put your own email in the `User-Agent` line in `server/fetchers.js`.

<br>

---

<br>

## Edit it

| To change | Go to |
| --- | --- |
| Any text on the site | [`TEXT-GUIDE.md`](TEXT-GUIDE.md) lists where every piece lives. Most is in `client/src/data/siteText.js` and `client/src/data/learnContent.js` |
| Beaches | `server/beaches.js` (copy a block, change the numbers) |
| Score weights and rules | The tables at the top of `server/safety.js` |
| Colors and fonts | The `:root` block in `client/src/styles/global.css` |
| Beach decorations | The `decorations` lists in `client/src/components/Scene.jsx` and `Story.jsx` |
| Menu style (wave button or top links) | `navStyle` in `client/src/data/siteText.js` |
| The overall look | [`DESIGN.md`](DESIGN.md) |

Check the scoring math any time, no internet needed:

```bash
npm run test:safety
```

### Project layout

```
canisurfthere/
  server/                 Node + Express server
    index.js              routes (/api/beaches and /api/surf/:id)
    beaches.js            the beach list
    fetchers.js           talks to the weather APIs
    safety.js             turns the numbers into one 0-100 score
    test-safety.js        quick test with fake data
  client/                 React site (Vite)
    src/pages/            Landing, Checker, Learn
    src/components/       ocean canvas, decorations, meter, menus
    src/data/             all the editable text
    src/styles/           CSS
  TEXT-GUIDE.md           where the text is and how to edit it
  DESIGN.md               design rules
  .github/workflows/      checks that run on every push
```

Built with React, Vite, Node, Express, GSAP, Lenis, Vanta.js and a hand-built canvas ocean.

<br>

---

<br>

## Put it on GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/canisurfthere.git
git push -u origin main
```

Search the project for `YOUR-USERNAME` (in `package.json` and this file) and replace it with your GitHub name. The first `npm run install-all` creates two `package-lock.json` files. Commit those too, so everyone installs the same versions.

## Put it online

The Express server also serves the built site, so you only need one host (Render, Railway, Fly...).

- **Build command:** `npm run install-all && npm run build`
- **Start command:** `npm start`

## Good to know

- Tide stations are the closest ones listed, not always right at the beach. If a station has no water temperature sensor, the app uses the ocean model's estimate.
- If one data source is down, the page still works and says what's missing.
- The rip current number is my own estimate from waves and wind, not an official forecast.

<br>

---

<br>

## Credits

- [GSAP](https://github.com/greensock/GSAP) and ScrollTrigger for scroll animations
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- [Vanta.js](https://github.com/tengbao/vanta) for the clouds on the field guide
- [React Bits](https://github.com/DavidHDev/react-bits): the split heading, scroll reveal, marquee, tilt card, spotlight card, magnet button and count up are small rewrites in its style
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) for the format of `DESIGN.md`

The ocean on the landing page and checker is drawn by hand on a canvas (`OceanCanvas.jsx`).

<br>

---

## Copyright

© 2026 Krishiv Chhabria. The CanISurfThere name, design, scoring method and calculated safety scores belong to Krishiv Chhabria. All rights reserved. See [`LICENSE`](LICENSE).

The underlying weather, wave, tide and alert data belong to Open-Meteo, NOAA and the National Weather Service.

Contact: [krchhabria@ucsd.edu](mailto:krchhabria@ucsd.edu)
