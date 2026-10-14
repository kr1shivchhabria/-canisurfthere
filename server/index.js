// index.js
// this is the node + express server.
// it has two jobs:
//   1. answer api requests from the react app (/api/beaches and /api/surf/:id)
//   2. in production, hand out the built react files from client/dist

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { beaches } from './beaches.js';
import { getMarine, getWeather, getTides, getWaterTemp, getAlerts } from './fetchers.js';
import { calculateSafety } from './safety.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // lets the react dev server (port 5173) talk to this server (port 3001)

// runs an api call, and if it breaks we just log it and return null
// that way one broken api does not crash the whole report
async function safely(name, fn) {
  try {
    return await fn();
  } catch (err) {
    console.log(`[${name}] failed:`, err.message);
    return null;
  }
}

// ---------- route 1: the list of beaches for the dropdown ----------
app.get('/api/beaches', (req, res) => {
  // only send what the dropdown needs
  res.json(beaches.map(({ id, name, city, state, group }) => ({ id, name, city, state, group })));
});

// ---------- route 2: the live surf report for one beach ----------
app.get('/api/surf/:id', async (req, res) => {
  const beach = beaches.find((b) => b.id === req.params.id);
  if (!beach) return res.status(404).json({ error: 'We do not have that beach yet.' });

  // call all five apis at the same time (faster than one after another)
  const [marine, weather, tide, waterTemp, alerts] = await Promise.all([
    safely('marine', () => getMarine(beach)),
    safely('weather', () => getWeather(beach)),
    safely('tides', () => getTides(beach)),
    safely('water temp', () => getWaterTemp(beach)),
    safely('alerts', () => getAlerts(beach)),
  ]);

  const timezone = weather ? weather.timezone : 'America/Los_Angeles';
  const safety = calculateSafety({ beach, marine, weather, tide, waterTemp, alerts, timezone });

  // if every single api failed there is nothing to show
  if (!safety) {
    return res.status(502).json({ error: 'Could not reach any of the data sources. Check your internet and try again.' });
  }

  res.set('Cache-Control', 'no-store'); // always fresh when the user presses refresh
  res.json({
    beach: { id: beach.id, name: beach.name, city: beach.city, state: beach.state },
    fetchedAt: new Date().toISOString(),
    timezone,
    safety,
    // tells the page which sources worked, so it can show a note if one is missing
    sources: {
      waves: !!marine,
      weather: !!weather,
      tides: !!tide,
      waterTemp: !!waterTemp,
      alerts: alerts !== null,
    },
  });
});

// ---------- production: serve the built react app ----------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distFolder = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distFolder));
// any other url goes to index.html so react-router can handle it (like /check)
app.get('*', (req, res) => {
  res.sendFile(path.join(distFolder, 'index.html'), (err) => {
    if (err) res.status(404).send('Run "npm run build" first, or use "npm run dev" while developing.');
  });
});

app.listen(PORT, () => console.log(`CanISurfThere server running on http://localhost:${PORT}`));
