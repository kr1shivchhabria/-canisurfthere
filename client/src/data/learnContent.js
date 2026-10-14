// learncontent.js
// all the words on the field guide page live here, so you can edit them without touching any react code.
// in any text, put ==double equals== around words to get the animated highlighter pen effect.

// the order of the sections (also the table of contents on the left side of the page)
export const sections = [
  { id: 'waves', label: 'Waves', kind: 'chapter' },
  { id: 'wind', label: 'Wind', kind: 'chapter' },
  { id: 'tide', label: 'Tides', kind: 'chapter' },
  { id: 'rips', label: 'Rip currents', kind: 'chapter' },
  { id: 'temp', label: 'Temperature', kind: 'chapter' },
  { id: 'sky', label: 'Sky and sun', kind: 'chapter' },
  { id: 'lineup', label: 'The lineup', kind: 'chapter' },
  { id: 'local', label: 'La Jolla breaks', kind: 'local' },
  { id: 'flags', label: 'Beach flags', kind: 'flags' },
  { id: 'rules', label: 'Dos and don\'ts', kind: 'rules' },
  { id: 'gear', label: 'Before you paddle', kind: 'gear' },
  { id: 'emergency', label: 'If it goes wrong', kind: 'emergency' },
];

// ---------------------------------------------------------------- the chapters
export const chapters = {
  waves: {
    title: 'Waves: size, period and direction',
    note: 'bigger is not always better',
    diagram: 'wave',
    intro: 'Three numbers describe a wave: how tall it is, how often one arrives, and which way it comes from. Together they tell you ==how much power the ocean is packing==.',
    points: [
      { h: 'Height', p: 'The height we show is the "significant wave height" from an ocean model: roughly the average of the biggest third of the waves. Single waves in a set can be noticeably bigger. If you are learning, knee to chest high (about 1 to 3 feet) is plenty.' },
      { h: 'Period', p: 'The seconds between two crests. Under 7 seconds is short, choppy, wind-made surf. Over 11 seconds is swell that traveled far and carries a lot of energy. A 3 foot wave at 15 seconds hits much harder than 3 feet at 6.' },
      { h: 'Direction', p: 'Which way the swell comes from decides which beaches get it. A west swell lights up west-facing beaches, while a sheltered cove can stay flat on the very same day.' },
      { h: 'Sets and lulls', p: 'Waves arrive in groups called sets, with calmer lulls between them. Watch for at least 15 minutes before you paddle out. The biggest set of the day is the one you have to be ready for.' },
    ],
    meter: 'Wave height scores best around 2 to 4 ft, slips past 6 ft and drops steeply above 10 ft. Period scores best from 7 to 11 seconds. Flat water (under 1 ft) is safe but not very surfable.',
  },

  wind: {
    title: 'Wind: glassy or a mess',
    note: 'offshore is your friend (mostly)',
    diagram: 'wind',
    intro: 'Wind shapes the surface of every wave. The direction compared to the beach matters just as much as the speed, so we work out ==onshore, offshore or cross-shore== for each beach.',
    points: [
      { h: 'Offshore', p: 'Blows from land out to sea. It holds the wave face up and grooms it smooth, which surfers call glassy. But strong offshore wind can push you away from shore faster than you can paddle back.' },
      { h: 'Onshore', p: 'Blows from the sea toward land. It makes the surface bumpy and the waves mushy. Light onshore is just annoying. Strong onshore piles up whitewater and makes paddling out exhausting.' },
      { h: 'Cross-shore', p: 'Blows along the beach. It is often fine when light, but it slowly drags you sideways down the beach, toward the next rip or the rocks, while you are not looking.' },
      { h: 'Gusts', p: 'Gusts are short bursts above the average wind. A steady 8 mph is pleasant. 8 mph gusting to 25 mph is not, because the water surface keeps changing on you.' },
    ],
    meter: 'Wind scores 100 up to 8 mph, falls to 60 at 18 mph and 30 at 25 mph. Strong offshore or onshore wind costs extra points, and gusts get their own score.',
  },

  tide: {
    title: 'Tides: the clock under every beach',
    note: 'check the schedule, then check it again',
    intro: 'Tides move the water up and down the beach about twice a day. They change where waves break, how deep the water is over rocks, and ==whether the beach is even walkable==.',
    points: [
      { h: 'Low tide', p: 'Exposes rocks, reef and shallow sandbars. Waves can break in very shallow water, and hitting the bottom is a real danger over reef or rock.' },
      { h: 'High tide', p: 'Pushes water up the beach, sometimes all the way to the cliffs. On beaches backed by cliffs, a rising tide can cut off your walk back.' },
      { h: 'Mid tide', p: 'Is the sweet spot at many beaches: enough water over the bottom, and enough beach left to get out.' },
      { h: 'Moving water', p: 'Currents around rocks, piers and inlets get stronger when the tide is running, fastest about halfway between high and low.' },
    ],
    meter: 'Mid tide scores best. Very low or very high tide costs up to 30 points. We use NOAA tide predictions from the closest station and estimate the height between the highs and lows.',
  },

  rips: {
    title: 'Rip currents: the ocean\'s conveyor belt',
    note: 'the one that actually gets people',
    diagram: 'rip',
    intro: 'A rip current is a narrow river of water pulling away from shore. It forms where waves push water up the beach and it hurries back out through a gap in the sandbars. ==Rips cause most lifeguard rescues== at surf beaches.',
    points: [
      { h: 'How to spot one', p: 'Look for a gap in the breaking waves, a channel of darker and calmer-looking water, choppy or foamy water heading out to sea, or a line of foam or seaweed drifting outward.' },
      { h: 'If you are caught', p: 'Do not fight it. Stay calm, float or hold on to your board, and swim parallel to the shore until you are out of the current, then angle back in. If you cannot get out, keep floating and wave for help.' },
      { h: 'Surfers and rips', p: 'A rip can make paddling out easy, which is exactly why it is tempting. Know where it is, and know how you will get back in before you use it.' },
      { h: 'Bigger swell, stronger rips', p: 'More wave energy pushes more water onto the beach, so rips get stronger and more frequent when the surf is up.' },
    ],
    meter: 'Our rip estimate adds a point for waves over 3 ft, over 5 ft, long period swell (11 s and up) and strong onshore wind, plus two points for any official rip current or high surf alert. It is an estimate. Lifeguards know the real beach.',
  },

  temp: {
    title: 'Water and air temperature',
    note: 'cold water is sneaky',
    intro: 'Even on a hot day the ocean can be cold enough to wear you out fast. Cold water ==steals strength and judgment== long before you feel really cold, so dress for the water, not the air.',
    points: [
      { h: 'Cold water fatigue', p: 'Muscles tire faster in cold water, which makes paddling, and escaping a rip, much harder. Keep early sessions short.' },
      { h: 'After you get out', p: 'Wind on wet skin makes you colder than the thermometer says. Bring a towel, dry layers and something warm to drink.' },
      { h: 'Listen to your body', p: 'Shivering you cannot stop, clumsy hands, or feeling confused are signs to get out and warm up right now.' },
    ],
    table: {
      head: ['Water temperature', 'What to wear'],
      rows: [
        ['75°F and up', 'Boardshorts or a bikini'],
        ['68 to 75°F', 'Rash guard or a spring suit'],
        ['62 to 68°F', '3/2 mm wetsuit'],
        ['56 to 62°F', '4/3 mm wetsuit'],
        ['50 to 56°F', '5/4 mm wetsuit with booties'],
        ['Under 50°F', '6/5 mm wetsuit with hood, gloves and booties'],
      ],
    },
    meter: 'Water temperature scores 100 at 70°F and above, 70 at 60°F, 50 at 55°F and just 25 at 50°F.',
  },

  sky: {
    title: 'Sky, sun and daylight',
    note: 'lightning does not care how good the waves are',
    intro: 'The sky can end a session faster than the surf can. Storms, fog and fading light are the three things to check before you ever paddle out.',
    points: [
      { h: 'Thunderstorms', p: 'If you can hear thunder, you are close enough to be struck. Get out of the water and off the beach, and ==wait 30 minutes after the last thunder== before going back in.' },
      { h: 'Fog and visibility', p: 'Fog hides other surfers, the shore, and the landmarks you use to stay in position. Under about a mile of visibility, stay home or stay very close to shore.' },
      { h: 'UV', p: 'UV peaks around midday and the water bounces it back at you. Wear reef-safe sunscreen, a rash guard and a hat for the walk.' },
      { h: 'Daylight', p: 'Dawn, dusk and dark are the hardest times to see hazards and be seen. Plan to be out of the water before sunset.' },
    ],
    meter: 'Thunderstorms push the meter close to zero. Darkness scores 10, and the last 45 minutes before sunset lower the score. Visibility under 1 mile scores 35 or less.',
  },

  lineup: {
    title: 'Sharing the lineup',
    note: 'the unwritten rules, written down',
    intro: 'The lineup is where surfers wait for waves, and it runs on a few simple rules. Learn them early and people will happily share a wave with you. Break them and you will ==get a lot of angry stares==.',
    points: [
      { h: 'Right of way', p: 'The surfer closest to the peak, where the wave first starts to break, has priority. If someone is already up and riding, that wave is theirs.' },
      { h: 'Never drop in', p: 'Taking off in front of someone who already has the wave is called dropping in, and it is how people get hurt. Look both ways before you paddle.' },
      { h: 'Paddle wide', p: 'When you paddle back out, go around the breaking waves, not through the people riding them.' },
      { h: 'Control your board', p: 'Never throw your board away from you. A loose board is a weapon in a crowd. If you wipe out, cover your head with your arms as you come up.' },
      { h: 'Be kind', p: 'Say hi, say sorry when you mess up, and share the waves. Beginners go in the smaller, less crowded part of the beach.' },
    ],
    meter: 'The meter cannot see crowds, but it will tell you the waves are small and gentle, the best days to learn.',
  },
};

// ---------------------------------------------------------------- la jolla (the three breaks the checker starts with)
export const localBreaks = [
  { name: 'La Jolla Shores', type: 'Sandy beach break', text: 'The gentlest of the three and a popular place to learn. Swimmers, kayakers and surf schools share the water, so watch for posted zones and give everyone room.' },
  { name: 'Windansea', type: 'Reef break', text: 'A wave breaking over rock, the kind that rewards local knowledge. Shallow rock below, a tight lineup, and a reputation for strict etiquette. Not the place to figure things out as a beginner.' },
  { name: "Black's Beach", type: 'Powerful beach break', text: 'Strong, hollow waves under tall cliffs, with a long walk or steep trail to reach it. At high tide parts of the beach can be cut off, and the bluffs erode, so never sit under them.' },
];

// ---------------------------------------------------------------- beach flags (colors can mean slightly different things at different beaches)
export const flags = [
  { color: '#2fb457', name: 'Green', text: 'Low hazard. Calm conditions, but the ocean is never risk free.' },
  { color: '#f6c84c', name: 'Yellow', text: 'Medium hazard. Moderate surf or currents. Be careful and stay alert.' },
  { color: '#e5484d', name: 'Red', text: 'High hazard. Strong surf or currents. Only strong swimmers should consider entering.' },
  { color: '#e5484d', name: 'Double red', text: 'Water closed to the public. Do not go in.', double: true },
  { color: '#8b5cf6', name: 'Purple', text: 'Dangerous marine life, like jellyfish or stingrays, has been spotted.' },
  { color: 'checker', name: 'Black and white checkered', text: 'Usually marks the area set aside for surfboards. Swimmers keep out. Check the local sign.' },
];

// ---------------------------------------------------------------- dos and don'ts
export const dos = [
  'Check the CanISurfThere meter and the posted flags first.',
  'Surf with a buddy, and choose a beach with lifeguards when you can.',
  'Watch the water for 15 minutes before you paddle out.',
  'Warm up and stretch. Cold muscles tear easily.',
  'Use a leash and a board that fits your level (soft-top boards for beginners).',
  'Know where you will get out, and where the rip current is.',
  'Wear reef-safe sunscreen and the right wetsuit for the water temperature.',
  'Tell someone your plan and when you will be back.',
  'Stay with your board if you get into trouble. It floats, you might not.',
];

export const donts = [
  "Don't surf alone, at dusk, or in the dark.",
  "Don't drop in on someone else's wave.",
  "Don't go out in a thunderstorm. Wait 30 minutes after the last thunder.",
  "Don't paddle straight against a rip current. Go sideways.",
  "Don't ignore warnings, red flags or an Avoid rating on the meter.",
  "Don't surf waves that are bigger than you are ready for. Nobody is impressed by a rescue.",
  "Don't surf near swimmers, kayakers or in marked swim zones.",
  "Don't throw your board away when you wipe out.",
  "Don't surf tired, sick or after drinking alcohol.",
];

// ---------------------------------------------------------------- the checklist
export const checklist = [
  'I checked the CanISurfThere meter and the beach flags',
  'I know the tide and when the next high and low are',
  'I watched the waves for 15 minutes',
  'I know where the rip current is and where I will exit',
  'I have a leash, wax and the right wetsuit',
  'I put on sunscreen (and I have water to drink)',
  'Someone knows where I am and when I will be back',
  'I will stay within my limits today',
];

// ---------------------------------------------------------------- emergency steps
export const emergency = [
  { h: 'Stay calm and float', p: 'Panic burns energy. Hold on to your board or lie on your back and float to catch your breath.' },
  { h: 'Signal for help', p: 'Raise one arm high, wave it, and start yelling loudly. Lifeguards are trained to watch for this.' },
  { h: 'Swim sideways, not straight in', p: 'If it is a rip current, swim parallel to the shore until the pull stops, then angle back toward the beach.' },
  { h: 'Call for help from shore', p: 'Get a lifeguard or call 911. Stay on the beach and point to where the person was last seen.' },
  { h: 'Do not become a second victim', p: 'If someone else is struggling, do not swim out to them. Throw something that floats (a board, a cooler lid, a life ring) and keep calling for help.' },
];

// words that slide across the strip under the title
export const marqueeWords = ['check the flags', 'never surf alone', 'respect the lineup', 'know your limits', 'watch before you paddle', 'swim parallel to a rip', 'wait 30 after thunder', 'leave before dark'];
