// safety.js
// this is the brain of the app. it takes raw numbers (waves, wind, tide...)
// and turns them into one score from 0 to 100.
//   0   = avoid (red end of the meter)
//   100 = ideal (green end of the meter)
//
// how it works, in plain words:
//   1. every condition gets its own score from 0 to 100 (a "factor")
//   2. each factor has a weight. waves matter more than uv, for example
//   3. we take the weighted average of all the factors
//   4. if a really dangerous thing is happening (huge waves, storm, dark, warnings)
//      we pull the final score down so one bad thing can not hide behind good ones

// ---------- small helpers ----------

// turns a degree number into a compass word. 270 degrees becomes west
const compassNames = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export function compass(deg) {
  if (deg == null) return '';
  return compassNames[Math.round(deg / 22.5) % 16];
}

// turns a number into a 0-100 score using a list of [number, score] points.
// it draws straight lines between the points. example: table [[0,100],[10,0]] with value 5 gives 50
function scoreFromTable(value, table) {
  if (value <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [x1, y1] = table[i];
    if (value <= x1) {
      const [x0, y0] = table[i - 1];
      const t = (value - x0) / (x1 - x0); // how far we are between the two points (0 to 1)
      return y0 + (y1 - y0) * t;
    }
  }
  return table[table.length - 1][1]; // past the end of the table
}

// shows a time like 2:41 pm in the time zone of the beach
function fmtTime(ms, timeZone) {
  return new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone });
}

// open-meteo gives local times like 2026-01-01t17:42. this turns that into 5:42 pm
function fmtLocal(str) {
  const [h, m] = str.slice(11, 16).split(':').map(Number);
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

// ---------- score tables (change these numbers to change how strict the meter is) ----------
// each pair is [measurement, score]

const waveHeightTable = [[0, 70], [1, 85], [2, 100], [4, 100], [6, 80], [8, 55], [10, 35], [15, 10], [20, 0]]; // feet
const wavePeriodTable = [[3, 55], [5, 70], [7, 95], [11, 100], [14, 80], [17, 55], [20, 40]]; // seconds
const windSpeedTable = [[0, 100], [8, 100], [12, 85], [18, 60], [25, 30], [35, 5]]; // mph
const gustTable = [[0, 100], [12, 100], [20, 75], [28, 45], [38, 15], [50, 0]]; // mph
const waterTempTable = [[40, 5], [50, 25], [55, 50], [60, 70], [65, 88], [70, 100]]; // degrees f
const airTempTable = [[20, 20], [40, 45], [50, 65], [60, 85], [68, 100], [88, 100], [95, 80], [105, 50], [115, 20]]; // feels like, f
const uvTable = [[0, 100], [5, 100], [7, 88], [10, 70], [13, 55]];
const visibilityTable = [[0, 5], [0.5, 15], [1, 35], [3, 65], [6, 95], [10, 100]]; // miles

// weather codes from open-meteo -> [words, score]
const weatherCodes = {
  0: ['Clear sky', 100], 1: ['Mostly clear', 100], 2: ['Partly cloudy', 100], 3: ['Overcast', 95],
  45: ['Fog', 55], 48: ['Freezing fog', 40],
  51: ['Light drizzle', 90], 53: ['Drizzle', 85], 55: ['Heavy drizzle', 75],
  56: ['Freezing drizzle', 40], 57: ['Freezing drizzle', 35],
  61: ['Light rain', 85], 63: ['Rain', 70], 65: ['Heavy rain', 45],
  66: ['Freezing rain', 30], 67: ['Freezing rain', 25],
  71: ['Light snow', 50], 73: ['Snow', 40], 75: ['Heavy snow', 30], 77: ['Snow grains', 40],
  80: ['Light showers', 85], 81: ['Showers', 70], 82: ['Violent showers', 40],
  85: ['Snow showers', 40], 86: ['Heavy snow showers', 30],
  95: ['Thunderstorm', 3], 96: ['Thunderstorm with hail', 0], 99: ['Severe thunderstorm with hail', 0],
};

// official warnings that cap the final score. the score can never be higher than the "cap".
// the word in "match" just has to appear somewhere in the alert name (lowercase)
const alertCaps = [
  { match: 'tsunami warning', cap: 0 },
  { match: 'tornado warning', cap: 0 },
  { match: 'hurricane warning', cap: 5 },
  { match: 'storm warning', cap: 10 }, // also catches "tropical storm warning"
  { match: 'special marine warning', cap: 15 },
  { match: 'thunderstorm warning', cap: 10 },
  { match: 'high surf warning', cap: 15 },
  { match: 'gale warning', cap: 20 },
  { match: 'hurricane watch', cap: 20 },
  { match: 'tropical storm watch', cap: 25 },
  { match: 'high surf advisory', cap: 35 },
  { match: 'rip current', cap: 40 },
  { match: 'beach hazards', cap: 40 },
  { match: 'small craft', cap: 65 },
  { match: 'coastal flood', cap: 70 },
];

// ---------- one factor = one card on the website ----------
// score = null means "we have no data for this one", so it is left out of the average
function makeFactor(id, title, score, value, detail, weight, critical = false) {
  return {
    id,
    title,
    score: score == null ? null : Math.round(score),
    value,
    detail,
    weight,
    critical, // critical factors can pull the whole score down on their own
  };
}
const noData = (id, title, weight, critical = false) =>
  makeFactor(id, title, null, 'No data', 'This source did not answer. Press refresh to try again.', weight, critical);

// ---------- wind: onshore, offshore or cross-shore? ----------
// windfrom is where the wind comes from. faces is where the beach looks (toward the sea).
// if the wind comes from the sea side, it is blowing onto the beach = onshore.
function windRelation(windFrom, faces) {
  let diff = Math.abs(windFrom - faces) % 360;
  if (diff > 180) diff = 360 - diff; // 0 to 180
  if (diff <= 60) return 'onshore';
  if (diff >= 120) return 'offshore';
  return 'cross-shore';
}

// ---------- tide math ----------
// we only get high and low tide times, so we guess the height in between with a cosine curve
function describeTide(events, nowMs) {
  if (!events || events.length < 3) return null;
  const nextIndex = events.findIndex((e) => e.time > nowMs); // first tide that has not happened yet
  if (nextIndex < 1) return null;
  const prev = events[nextIndex - 1];
  const next = events[nextIndex];

  const progress = (nowMs - prev.time) / (next.time - prev.time); // 0 to 1
  const height = prev.feet + ((next.feet - prev.feet) * (1 - Math.cos(Math.PI * progress))) / 2;
  const rising = next.type === 'H'; // if the next tide is a high, the water is coming in

  // where are we between the lowest and highest nearby tide? 0 = very low, 1 = very high
  const nearby = events.slice(Math.max(0, nextIndex - 2), nextIndex + 2).map((e) => e.feet);
  const low = Math.min(...nearby);
  const high = Math.max(...nearby);
  const fraction = (height - low) / (high - low || 1);

  const upcoming = events.slice(nextIndex);
  return {
    height,
    rising,
    fraction,
    nextHigh: upcoming.find((e) => e.type === 'H'),
    nextLow: upcoming.find((e) => e.type === 'L'),
  };
}

// ---------- wetsuit tip ----------
function wetsuitFor(waterF) {
  if (waterF == null) return null;
  if (waterF >= 75) return 'Boardshorts or a bikini is fine';
  if (waterF >= 68) return 'Rash guard or a spring suit';
  if (waterF >= 62) return '3/2 mm wetsuit';
  if (waterF >= 56) return '4/3 mm wetsuit';
  if (waterF >= 50) return '5/4 mm wetsuit with booties';
  return '6/5 mm wetsuit with hood, gloves and booties';
}

// ---------- labels for the meter ----------
function labelFor(score) {
  if (score >= 85) return { label: 'Ideal', verdict: 'Conditions look great. Wax up and have fun.' };
  if (score >= 70) return { label: 'Good', verdict: 'Solid conditions. Normal ocean awareness applies.' };
  if (score >= 50) return { label: 'Use caution', verdict: 'Surfable, but something is off. Read the details below first.' };
  if (score >= 30) return { label: 'Poor', verdict: 'Only for experienced surfers who know this spot well.' };
  return { label: 'Avoid', verdict: 'Stay out of the water right now.' };
}

// ====================================================================
// the main function. index.js calls this with everything the apis returned.
// any of marine / weather / tide / watertemp / alerts can be null if that api failed.
// ====================================================================
export function calculateSafety({ beach, marine, weather, tide, waterTemp, alerts, timezone, now = new Date() }) {
  const factors = [];
  const nowMs = now.getTime();

  // ---- waves (critical) ----
  if (marine) {
    const ft = marine.waveFt;
    const size = ft < 1 ? 'basically flat' : ft < 2 ? 'small' : ft < 4 ? 'fun size' : ft < 6 ? 'solid' : ft < 8 ? 'big' : ft < 12 ? 'very big' : 'huge';
    let detail = `${size}, coming from the ${compass(marine.waveDir)}.`;
    if (marine.swellFt != null) detail += ` Swell: ${marine.swellFt.toFixed(1)} ft at ${Math.round(marine.swellPeriod)} sec.`;
    factors.push(makeFactor('waves', 'Wave height', scoreFromTable(ft, waveHeightTable), `${ft.toFixed(1)} ft`, detail, 20, true));
  } else factors.push(noData('waves', 'Wave height', 20, true));

  // ---- wave period ----
  if (marine && marine.wavePeriod != null) {
    const t = marine.wavePeriod;
    const heightM = marine.waveFt / 3.28084;
    const power = 0.49 * heightM * heightM * t; // classic wave power formula, kw per meter of wave
    const feel = t < 7 ? 'short and choppy' : t < 12 ? 'clean and organized' : 'long and powerful';
    factors.push(makeFactor('period', 'Wave period', scoreFromTable(t, wavePeriodTable), `${Math.round(t)} sec`, `${feel}. About ${power.toFixed(0)} kW of power per meter of wave.`, 6));
  } else factors.push(noData('period', 'Wave period', 6));

  // ---- wind (critical) + gusts ----
  let relation = null;
  if (weather) {
    relation = windRelation(weather.windDir, beach.faces);
    let windScore = scoreFromTable(weather.windMph, windSpeedTable);
    let explain = 'blowing along the beach.';
    if (weather.windMph < 5) explain = 'calm, so direction barely matters.';
    else if (relation === 'onshore') explain = 'blowing in from the sea, which makes the waves choppy.';
    else if (relation === 'offshore') explain = 'blowing out to sea. Waves stay clean, but strong offshore wind can push you away from shore.';
    // strong wind in a bad direction costs extra points
    if (weather.windMph >= 12 && relation === 'offshore') windScore *= 0.85;
    if (weather.windMph >= 12 && relation === 'onshore') windScore *= 0.9;
    factors.push(makeFactor('wind', 'Wind', windScore, `${Math.round(weather.windMph)} mph ${compass(weather.windDir)}`, `${relation[0].toUpperCase() + relation.slice(1)} wind, ${explain}`, 14, true));
    factors.push(makeFactor('gusts', 'Wind gusts', scoreFromTable(weather.gustMph, gustTable), `${Math.round(weather.gustMph)} mph`, weather.gustMph - weather.windMph > 10 ? 'Gusty. Wind speed will jump around.' : 'Steady wind, no big gusts.', 6));
  } else {
    factors.push(noData('wind', 'Wind', 14, true));
    factors.push(noData('gusts', 'Wind gusts', 6));
  }

  // ---- tide ----
  const tideInfo = describeTide(tide, nowMs);
  if (tideInfo) {
    // mid tide is usually best. very low or very high tide costs up to 30 points
    const distanceFromMiddle = Math.abs(tideInfo.fraction - 0.5);
    const tideScore = 100 - (Math.max(0, distanceFromMiddle - 0.25) / 0.25) * 30;
    const next = tideInfo.rising ? tideInfo.nextHigh : tideInfo.nextLow;
    const other = tideInfo.rising ? tideInfo.nextLow : tideInfo.nextHigh;
    const nextText = (e, word) => (e ? `${word} at ${fmtTime(e.time, timezone)} (${e.feet.toFixed(1)} ft)` : '');
    factors.push(makeFactor('tide', 'Tide', tideScore, `${tideInfo.height.toFixed(1)} ft, ${tideInfo.rising ? 'rising' : 'falling'}`, `${nextText(next, tideInfo.rising ? 'High' : 'Low')}. ${nextText(other, tideInfo.rising ? 'Low' : 'High')}.`, 6));
  } else factors.push(noData('tide', 'Tide', 6));

  // ---- water temperature (real sensor first, model second) ----
  const waterF = waterTemp ? waterTemp.f : marine ? marine.seaTempF : null;
  if (waterF != null) {
    const source = waterTemp ? 'NOAA station reading' : 'ocean model estimate';
    factors.push(makeFactor('water', 'Water temp', scoreFromTable(waterF, waterTempTable), `${Math.round(waterF)}°F`, `Wear: ${wetsuitFor(waterF)}. (${source})`, 10));
  } else factors.push(noData('water', 'Water temp', 10));

  // ---- air temp, uv, visibility ----
  if (weather) {
    factors.push(makeFactor('air', 'Air temp', scoreFromTable(weather.feelsF, airTempTable), `${Math.round(weather.airF)}°F`, `Feels like ${Math.round(weather.feelsF)}°F.`, 5));

    if (weather.uv != null) {
      const level = weather.uv < 3 ? 'low' : weather.uv < 6 ? 'moderate' : weather.uv < 8 ? 'high' : 'very high';
      factors.push(makeFactor('uv', 'UV index', scoreFromTable(weather.uv, uvTable), weather.uv.toFixed(1), `${level[0].toUpperCase() + level.slice(1)} sun risk.${weather.uv >= 3 ? ' Wear reef-safe sunscreen.' : ''}`, 3));
    } else factors.push(noData('uv', 'UV index', 3));

    if (weather.visibilityMi != null) {
      const mi = weather.visibilityMi;
      factors.push(makeFactor('visibility', 'Visibility', scoreFromTable(mi, visibilityTable), `${mi >= 10 ? '10+' : mi.toFixed(1)} mi`, mi < 1 ? 'Heavy fog. Hard to see other people or the shore.' : mi < 3 ? 'Hazy. Stay close to shore.' : 'Clear view of the water.', 6));
    } else factors.push(noData('visibility', 'Visibility', 6));

    // ---- sky: storms, rain, fog (critical) ----
    const [words, skyScore] = weatherCodes[weather.code] || ['Unknown', 80];
    const stormy = weather.code >= 95;
    factors.push(makeFactor('sky', 'Sky', skyScore, words, stormy ? 'Lightning risk. Get out of the water and stay out.' : weather.rainMm > 0 ? `${weather.rainMm.toFixed(1)} mm of rain this hour.` : 'No rain right now.', 8, true));

    // ---- daylight (critical) ----
    // both times are local strings, so we can subtract them directly (we add a z so javascript reads them the same way)
    const minsToSunset = (Date.parse(weather.sunset + 'Z') - Date.parse(weather.localTime + 'Z')) / 60000;
    const minsSinceSunrise = (Date.parse(weather.localTime + 'Z') - Date.parse(weather.sunrise + 'Z')) / 60000;
    let lightScore = 100;
    let lightDetail = `Sunrise ${fmtLocal(weather.sunrise)}, sunset ${fmtLocal(weather.sunset)}.`;
    let lightValue = `${Math.floor(minsToSunset / 60)}h ${Math.round(minsToSunset % 60)}m of light`;
    if (!weather.isDay) {
      lightScore = 10;
      lightValue = 'Dark';
      lightDetail = `The sun is down. ${lightDetail} Surfing in the dark is very risky.`;
    } else if (minsToSunset < 45) {
      lightScore = 60;
      lightDetail = `Sunset is close. ${lightDetail}`;
    } else if (minsToSunset < 90) lightScore = 85;
    else if (minsSinceSunrise < 30) lightScore = 75;
    factors.push(makeFactor('daylight', 'Daylight', lightScore, lightValue, lightDetail, 4, true));
  } else {
    factors.push(noData('air', 'Air temp', 5));
    factors.push(noData('uv', 'UV index', 3));
    factors.push(noData('visibility', 'Visibility', 6));
    factors.push(noData('sky', 'Sky', 8, true));
    factors.push(noData('daylight', 'Daylight', 4, true));
  }

  // ---- rip current risk (an estimate, not an official number) ----
  // we add a point for each thing that makes rips more likely
  const alertList = alerts || [];
  const ripAlert = alertList.some((a) => /rip current|beach hazards|high surf/i.test(a.event));
  if (marine) {
    let points = 0;
    if (marine.waveFt >= 3) points += 1; // bigger waves push more water in
    if (marine.waveFt >= 5) points += 1;
    if (marine.wavePeriod >= 11) points += 1; // long period swell pushes more water in
    if (relation === 'onshore' && weather.windMph >= 12) points += 1;
    if (ripAlert) points += 2; // the weather service already warned about it
    const levels = [['Low', 100], ['Low to moderate', 85], ['Moderate', 60], ['High', 35], ['Very high', 15]];
    const [levelWord, levelScore] = levels[Math.min(points, 4)];
    factors.push(makeFactor('rip', 'Rip current risk', levelScore, levelWord, ripAlert ? 'The weather service has an active warning for this area.' : 'Our own estimate from waves and wind. Always check the lifeguard flags.', 12, true));
  } else factors.push(noData('rip', 'Rip current risk', 12, true));

  // ---------- step 3: weighted average ----------
  const scored = factors.filter((f) => f.score != null);
  if (scored.length === 0) return null; // nothing worked at all

  const totalWeight = scored.reduce((sum, f) => sum + f.weight, 0);
  const average = scored.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight;

  // ---------- step 4: danger caps ----------
  let finalScore = average;

  // the worst critical factor drags the score down (it can only be 25 points above that factor)
  const criticalScores = scored.filter((f) => f.critical).map((f) => f.score);
  if (criticalScores.length > 0) finalScore = Math.min(finalScore, Math.min(...criticalScores) + 25);

  // official warnings cap the score too
  const matchedAlerts = alertList.map((a) => {
    const name = a.event.toLowerCase();
    const caps = alertCaps.filter((c) => name.includes(c.match)).map((c) => c.cap);
    return { ...a, cap: caps.length ? Math.min(...caps) : null };
  });
  matchedAlerts.forEach((a) => {
    if (a.cap != null) finalScore = Math.min(finalScore, a.cap);
  });

  // if a critical thing could not be checked (wind, storms, daylight...) we can not honestly say "ideal"
  const missingCritical = factors.filter((f) => f.score == null && f.critical).length;
  if (missingCritical > 0) finalScore = Math.min(finalScore, 79);
  // if more than half of the data is missing, be even more careful
  const allWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  if (totalWeight / allWeight < 0.5) finalScore = Math.min(finalScore, 60);

  finalScore = Math.round(Math.max(0, Math.min(100, finalScore)));
  const { label, verdict } = labelFor(finalScore);

  // the top 4 things dragging the score down, so the user knows why
  const watchOuts = [...scored]
    .filter((f) => f.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map((f) => `${f.title}: ${f.value}. ${f.detail}`);
  if (missingCritical > 0) watchOuts.push('Some important data is missing, so this score is capped. Press refresh to try again.');

  return {
    score: finalScore,
    label,
    verdict,
    wetsuit: wetsuitFor(waterF),
    factors,
    watchOuts,
    alerts: matchedAlerts.filter((a) => a.cap != null).map((a) => ({ event: a.event, headline: a.headline })),
    isNight: Boolean(weather && weather.isDay === false), // true when the sun is down, so the page can explain the low score
  };
}
