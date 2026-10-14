// test-safety.js
// a quick check of the safety math with fake data. run it with: npm run test:safety
// no internet needed. if the numbers look silly after you change safety.js, you will see it here.

import { calculateSafety } from './safety.js';

const beach = { faces: 270 }; // a beach that looks west

// a pretty perfect day: 3 ft clean waves, light offshore wind, warm water, midday
const now = new Date('2026-07-01T20:00:00Z'); // 1pm in california
const tide = [
  { time: Date.parse('2026-07-01T16:00:00Z'), feet: 0.5, type: 'L' },
  { time: Date.parse('2026-07-01T22:00:00Z'), feet: 4.5, type: 'H' },
  { time: Date.parse('2026-07-02T04:00:00Z'), feet: 0.2, type: 'L' },
];
const goodDay = {
  beach, now, timezone: 'America/Los_Angeles', tide, alerts: [],
  marine: { waveFt: 3, waveDir: 270, wavePeriod: 9, swellFt: 2.5, swellDir: 270, swellPeriod: 10, seaTempF: 70 },
  weather: { localTime: '2026-07-01T13:00', sunrise: '2026-07-01T05:45', sunset: '2026-07-01T20:00', isDay: true,
    airF: 76, feelsF: 76, rainMm: 0, code: 1, windMph: 6, windDir: 90, gustMph: 9, uv: 7, visibilityMi: 10 },
  waterTemp: { f: 69 },
};

// same day, but huge waves, a storm and a rip current warning
const badDay = {
  ...goodDay,
  marine: { ...goodDay.marine, waveFt: 12, wavePeriod: 15 },
  weather: { ...goodDay.weather, code: 95, windMph: 28, windDir: 270, gustMph: 40 },
  alerts: [{ event: 'High Surf Warning', headline: 'big surf' }],
};

const good = calculateSafety(goodDay);
const bad = calculateSafety(badDay);
console.log('good day ->', good.score, good.label);
console.log('bad day  ->', bad.score, bad.label);

// the meter should clearly separate these two days
if (good.score < 85 || bad.score > 15) {
  console.log('something is off with the scoring!');
  process.exit(1);
}
console.log('safety math looks right.');
