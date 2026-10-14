// fetchers.js
// this file talks to the public apis. none of them need an api key.
//   open-meteo marine  -> waves and swell
//   open-meteo weather -> wind, air temp, uv, visibility, sunrise/sunset
//   noaa co-ops        -> tide predictions and real water temperature
//   weather.gov        -> official warnings (rip currents, high surf...)
// every function returns a small clean object, or throws if the api is down.
// index.js catches the errors so one broken api does not break the whole page.

// weather.gov asks every app to say who it is. put your own email here.
const HEADERS = {
  'User-Agent': 'CanISurfThere student project (your-email@example.com)',
  Accept: 'application/json',
};

// small helper: fetch json and give up after 8 seconds
async function getJson(url) {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${res.status} from ${url.split('?')[0]}`);
  return res.json();
}

// unit helpers
const metersToFeet = (m) => (m == null ? null : m * 3.28084);
const celsiusToF = (c) => (c == null ? null : (c * 9) / 5 + 32);

// ---------- waves ----------
export async function getMarine(beach) {
  const [lat, lon] = beach.sea; // use the spot out in the water
  const vars = [
    'wave_height', 'wave_direction', 'wave_period',
    'swell_wave_height', 'swell_wave_direction', 'swell_wave_period',
    'sea_surface_temperature',
  ].join(',');
  const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=${vars}&timezone=auto`;
  const data = await getJson(url);
  const c = data.current;
  if (!c || c.wave_height == null) throw new Error('no wave data at this spot');
  return {
    waveFt: metersToFeet(c.wave_height),
    waveDir: c.wave_direction,
    wavePeriod: c.wave_period,
    swellFt: metersToFeet(c.swell_wave_height),
    swellDir: c.swell_wave_direction,
    swellPeriod: c.swell_wave_period,
    seaTempF: celsiusToF(c.sea_surface_temperature),
  };
}

// ---------- weather ----------
export async function getWeather(beach) {
  const vars = [
    'temperature_2m', 'apparent_temperature', 'precipitation', 'weather_code',
    'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'is_day',
  ].join(',');
  // uv and visibility come from the hourly list (more reliable than "current")
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${beach.lat}&longitude=${beach.lon}` +
    `&current=${vars}&hourly=uv_index,visibility&daily=sunrise,sunset` +
    `&wind_speed_unit=mph&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`;
  const data = await getJson(url);
  const c = data.current;

  // find the hourly row that matches right now (times look like 2026-01-01t14:00)
  const hourKey = c.time.slice(0, 13);
  const hourIndex = data.hourly.time.findIndex((t) => t.startsWith(hourKey));
  const uv = hourIndex >= 0 ? data.hourly.uv_index[hourIndex] : null;
  const visibilityMeters = hourIndex >= 0 ? data.hourly.visibility[hourIndex] : null;

  return {
    timezone: data.timezone,
    localTime: c.time,
    airF: c.temperature_2m,
    feelsF: c.apparent_temperature,
    rainMm: c.precipitation,
    code: c.weather_code,
    windMph: c.wind_speed_10m,
    windDir: c.wind_direction_10m,
    gustMph: c.wind_gusts_10m,
    isDay: c.is_day === 1,
    uv,
    visibilityMi: visibilityMeters == null ? null : visibilityMeters / 1609.34,
    sunrise: data.daily.sunrise[0],
    sunset: data.daily.sunset[0],
  };
}

// ---------- tides ----------
// noaa wants dates like 20260101. we ask for yesterday through tomorrow
// so we always have a "previous" and a "next" tide to work with.
const ymd = (d) => d.toISOString().slice(0, 10).replaceAll('-', '');

export async function getTides(beach) {
  const yesterday = new Date(Date.now() - 24 * 3600 * 1000);
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions` +
    `&application=CanISurfThere&begin_date=${ymd(yesterday)}&end_date=${ymd(tomorrow)}` +
    `&datum=MLLW&station=${beach.station}&time_zone=gmt&units=english&interval=hilo&format=json`;
  const data = await getJson(url);
  if (!data.predictions) throw new Error('no tide predictions for this station');
  // each item has a time (t), a height (v) and a type (h or l)
  return data.predictions.map((p) => ({
    time: new Date(p.t.replace(' ', 'T') + ':00Z').getTime(), // gmt time in milliseconds
    feet: parseFloat(p.v),
    type: p.type, // h = high tide, l = low tide
  }));
}

// ---------- real water temperature ----------
export async function getWaterTemp(beach) {
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=water_temperature` +
    `&application=CanISurfThere&date=latest&station=${beach.station}&time_zone=gmt&units=english&format=json`;
  const data = await getJson(url);
  if (!data.data || !data.data[0]) throw new Error('this station has no water temp sensor');
  return { f: parseFloat(data.data[0].v), station: beach.station };
}

// ---------- official alerts ----------
export async function getAlerts(beach) {
  const url = `https://api.weather.gov/alerts/active?point=${beach.lat.toFixed(4)},${beach.lon.toFixed(4)}`;
  const data = await getJson(url);
  return data.features.map((f) => ({
    event: f.properties.event, // example: beach hazards statement
    severity: f.properties.severity,
    headline: f.properties.headline,
  }));
}
