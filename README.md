<div align="center">

# 🏄 CanISurfThere

### Is it safe to surf where you are right now?

**A live surf safety meter.** Pick a beach, press refresh, and get one honest score from **Avoid** 🔴 to **Ideal** 🟢, built from live waves, wind, tide, temperature, sky, daylight and official warnings.

![React](https://img.shields.io/badge/React-18-4fb4ea?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-072f4d?style=for-the-badge&logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node-18.11%2B-0b4a75?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-ecd9ad?style=for-the-badge&logo=express&logoColor=072f4d)
![Data](https://img.shields.io/badge/data-free%20public%20APIs-4fb4ea?style=for-the-badge)

[Quick start](#-quick-start) · [How to run it](#-how-to-run-it) · [How the score works](#-how-the-score-works) · [Edit the text](#-changing-the-words-beaches-and-colors) · [Credits](#-credits)

</div>

---

## 🌊 What is this?

CanISurfThere covers **three beaches in La Jolla, San Diego** (Windansea, Black's Beach and La Jolla Shores) plus **ten of the most popular beaches in the USA**. It also has a long, illustrated landing page and a full **Surf Field Guide** on how to read the ocean and stay safe.

Built by **Krishiv Chhabria**, an international CS student at UC San Diego, who fell in love with surfing in SoCal and wanted a site that says when it is actually safe.

| 🏖️ Landing page | 📊 Surf checker | 📖 Field guide |
| --- | --- | --- |
| An illustrated ocean-to-sand scroll with a big **Can I Surf Here?** button | Pick a beach and get the meter plus 12 condition cards | Waves, rips, etiquette, and when to stay out of the water |

> [!WARNING]
> This is a student project. Every score is an **estimate** from public prediction models. It is **not** a replacement for lifeguards, posted flags or your own judgment. If you are unsure, stay out of the water.

---

## ⚡ Quick start

Already have Node.js 18.11 or newer? Three commands:

```bash
npm run install-all   # one time, takes 1 to 3 minutes
npm run dev           # starts the site and the server
# then open http://localhost:5173
```

New to this? The full step-by-step guide is right below. 👇

---

## 🚀 How to run it

> [!NOTE]
> You can edit this section any time. It is plain text. Add your own steps, screenshots or notes.

You need **internet** (the live ocean data comes from free public websites) and about 5 minutes the first time.

### 1. Install Node.js (one time only)

Node.js is what runs the project. It comes with a tool called `npm`.

1. Go to **https://nodejs.org** and download the **LTS** version.
2. Install it (click Continue / Next until it finishes).
3. **Close your terminal completely and open a new one.**
4. Check it worked by typing these two lines (press Enter after each):

   ```
   node -v
   npm -v
   ```

   Both should print a version number. You need Node **18.11 or newer** (20 or newer is best).

### 2. Get the project

Pick one:

- **With git:**
  ```
  git clone https://github.com/YOUR-USERNAME/canisurfthere.git
  ```
- **Without git:** on the GitHub page click the green **Code** button, then **Download ZIP**, and unzip it.

### 3. Open a terminal inside the project folder

- **Mac:** open **Terminal**, type `cd ` (the letters c, d and a space), drag the `canisurfthere` folder from Finder into the Terminal window, and press Enter.
- **Windows:** open the `canisurfthere` folder in File Explorer, click the address bar, type `cmd` and press Enter.

To check you are in the right place, type `ls` (Mac) or `dir` (Windows). You should see `package.json`, `client` and `server`.

### 4. Install everything (one time only)

```
npm run install-all
```

This takes 1 to 3 minutes.

### 5. Start the website

```
npm run dev
```

Wait until you see a line with `http://localhost:5173`.

### 6. Open it

Go to **http://localhost:5173** in your browser.

- Click the big **Can I Surf Here?** button to open the surf checker.
- Use the wave button in the top right to jump between pages (or switch to a top bar of links with `navStyle` in `siteText.js`).

### 🔁 Next time

You only need two commands:

```
cd path/to/canisurfthere
npm run dev
```

Press **Control + C** in the terminal to stop it.

### 🛟 If something goes wrong

| Problem | Fix |
| --- | --- |
| `command not found: npm` or `'npm' is not recognized` | Node.js is not installed, or you did not reopen the terminal after installing it. Do step 1 again. |
| `Port 5173 is already in use` | Another copy is still running. Close the other terminal windows and try again. |
| Red errors during `npm run install-all` | Check `node -v` is 18.11 or newer, delete the `node_modules` folders, and run it again. |
| The page says it cannot reach the server | The server did not start. Run `npm run dev` from the main project folder (not the `client` folder). |
| Meter cards say "No data" | One of the public data websites did not answer. Press **Refresh** in a few seconds. |
| Fonts look different | The fonts load from Google Fonts, so they need internet. |

### 📦 Run the finished (production) version

```
npm run install-all
npm run build
npm start
```

Then open **http://localhost:3001**. The Node server now serves the built website and the data together.

---

## 🎨 Changing the words, beaches and colors

- **All the text:** read [`TEXT-GUIDE.md`](TEXT-GUIDE.md). It lists where the words on every page live and how to edit them. Most of it is in `client/src/data/siteText.js` and `client/src/data/learnContent.js`.
- **Beaches:** `server/beaches.js`. Copy a block, change the numbers, save.
- **How the score is calculated:** the tables at the top of `server/safety.js`.
- **Colors and fonts:** the `:root` block in `client/src/styles/global.css`.
- **Beach decorations (crabs, beach balls...):** the `decorations` lists in `client/src/components/Scene.jsx` and `Story.jsx`.
- **The look in general:** [`DESIGN.md`](DESIGN.md).

Check the scoring math any time (no internet needed): `npm run test:safety`

---

## 🗂️ What is inside

```
canisurfthere/
  server/                 the Node + Express server
    index.js              routes (/api/beaches and /api/surf/:id)
    beaches.js            the list of beaches
    fetchers.js           talks to the public weather APIs
    safety.js             turns the numbers into one 0-100 score
    test-safety.js        quick test with fake data
  client/                 the React website (Vite)
    src/pages/            Landing, Checker (the meter) and Learn (the field guide)
    src/components/       ocean canvas, decorations, meter, dropdown, wave menu...
    src/data/             all the editable text
    src/styles/           the CSS
  TEXT-GUIDE.md           where the text is and how to edit it
  DESIGN.md               the design rules
  .github/workflows/      a check that runs on every push
```

**Built with:** React, Vite, Node, Express, GSAP (animations), Lenis (smooth scrolling), Vanta.js (clouds on the field guide) and a hand-built canvas ocean.

## 🧮 How the score works

1. Every condition (wave height, wave period, wind, gusts, tide, water temperature, air temperature, UV, visibility, sky, rip current risk, daylight) gets its own score from 0 to 100.
2. Each one has a weight (waves matter more than UV).
3. The final score is the weighted average.
4. Dangerous things pull the score down by themselves: huge waves, storms, darkness, strong wind, a high rip risk and official warnings. One bad thing cannot hide behind good ones.
5. If key data is missing, the score is capped so it never says "Ideal" without checking everything.

| Score | Label |
| --- | --- |
| 85 and up | 🟢 **Ideal** |
| 70 to 84 | 🟩 **Good** |
| 50 to 69 | 🟨 **Use caution** |
| 30 to 49 | 🟧 **Poor** |
| under 30 | 🔴 **Avoid** |

## 📡 Data sources (all free, no keys)

- [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api): waves and swell
- [Open-Meteo Weather API](https://open-meteo.com/en/docs): wind, temperature, UV, visibility, sunrise and sunset
- [NOAA CO-OPS](https://api.tidesandcurrents.noaa.gov/api/prod/): tides and water temperature
- [National Weather Service](https://www.weather.gov/documentation/services-web-api): rip current and high surf alerts

Open-Meteo is free for non-commercial use. weather.gov asks apps to identify themselves, so put your own email in the `User-Agent` line in `server/fetchers.js`.

## 🐙 Put it on GitHub

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/canisurfthere.git
git push -u origin main
```

Then search the project for `YOUR-USERNAME` (in `package.json` and this file) and replace it with your GitHub name. The first time you run `npm run install-all`, npm creates two `package-lock.json` files. Commit those too, so everyone installs the exact same versions.

## ☁️ Put it online

The Express server also serves the built website, so you only need one host (Render, Railway, Fly...).

- **Build command:** `npm run install-all && npm run build`
- **Start command:** `npm start`

## 💡 Good to know

- Tide stations are the closest ones listed, not always right at the beach. If a station has no water temperature sensor, the app uses the ocean model estimate.
- If one data source is down, the page still works and tells you what is missing.
- The rip current number is our own estimate from waves and wind, not an official forecast.

## 🙏 Credits

- [GSAP](https://github.com/greensock/GSAP) and ScrollTrigger: scroll animations
- [Lenis](https://github.com/darkroomengineering/lenis): smooth scrolling
- [Vanta.js](https://github.com/tengbao/vanta): the clouds on the field guide page
- [React Bits](https://github.com/DavidHDev/react-bits): the split heading, scroll reveal, marquee, tilt card, spotlight card, magnet button and count up are small rewrites in its style
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md): the format of `DESIGN.md`

The ocean on the landing page and checker is drawn by hand on a canvas (`OceanCanvas.jsx`).

## ©️ Copyright

© 2026 Krishiv Chhabria. The CanISurfThere name, design, scoring method and calculated safety scores belong to Krishiv Chhabria. All rights reserved. See [`LICENSE`](LICENSE).

The underlying weather, wave, tide and alert data belong to Open-Meteo, NOAA and the National Weather Service.

Contact: [krchhabria@ucsd.edu](mailto:krchhabria@ucsd.edu)

---

<div align="center">

Made with 🌊 in La Jolla by [Krishiv Chhabria](mailto:krchhabria@ucsd.edu)

</div>
