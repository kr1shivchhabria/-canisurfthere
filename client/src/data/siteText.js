// sitetext.js
// all the words on the landing page, the wave menu and the surf checker live in this one file.
// (the field guide page has its own text file: data/learncontent.js. see text-guide.md at the top of the project.)
//
// how to edit:
//   1. change the words between the quote marks, then save. the page updates by itself.
//   2. if your text has an apostrophe (like i'm) keep the double quotes around it: "hi, i'm krishiv."
//   3. put **two stars** around words to make them bold, like **click here**
//   4. words in {curly brackets} (like {time}) get filled in by the page. keep them in your sentence.

export const siteText = {
  // ============================================================ landing page (the "/" page)
  landing: {
    // ---- the long ocean at the top
    hero: {
      tag: 'Is it safe to surf where you are right now?', // small handwriting above the title
      title: 'Can I Surf There?', // the big title
      underlinedWord: 'Surf', // which word of the title gets the wavy yellow underline
      subtitle: 'A safety meter which analyzes waves, wind, tide and temperature in real time',
      navHint: 'navigate\nsite', // the little note by the menu button. a \n starts the second line
      scrollHint: 'scroll down, the ocean is calling', // handwriting near the bottom of the ocean
    },

    // ---- the sand with the big button
    button: {
      intro: 'okay, this is the part you came for', // handwriting above the button
      label: 'Can I Surf Here?', // the words on the big button
      help: '**click here** to check if you can actually surf here right now', // handwriting under the button
      scrollNote: 'psst… scroll down and see why I made this', // bottom of the button screen
    },

    // ---- the about me section
    story: {
      note: 'the story behind it', // small handwriting above the heading
      title: "Hi, I'm Krishiv.",
      // a "\n\n" in the text starts a new paragraph
      body:
        'I’m an international student studying CS at UCSD, and one thing I fell in love with immediately when I came to SoCal was the amount of beaches and surfing. ' +
        'There was only one problem though, with the wind, water, current, and more, I never really knew when it was gonna be safe to surf at all. ' +
        'Instead of looking for a site to tell me that, I decided to build one myself.' +
        '\n\n' +
        'CanISurfThere takes into account wind, wave periods, daylight, weather, and alerts all through live updates from official public weather sources. ' +
        'It takes every variable into account and gives a final “score”, which tells you whether the weather is ideal to surf or not. ' +
        'It looks at the statistics with respect to 3 beaches in La Jolla, San Diego, in addition to the 10 other most popular beaches in the country.' +
        '\n\n' +
        'This site is open and accessible, and anyone who wants to analyze the motion of the ocean should be able to. ' +
        'If even one surfer finds this site to be even remotely helpful, my mission is complete.',
      postcardTitle: 'Greetings from La Jolla!', // the postcard next to it
      postcardCoords: '32.83° N, 117.27° W',
      postcardStamp: 'CA',
    },

    // ---- the patch of ocean that leads to the field guide
    guidePrompt: {
      note: 'one last page i promise',
      title: 'Want to **learn how to ride a wave** too?', // the words between the **stars** get a soft glow
      text: 'Check out my field guide below on how to read waves, spot a rip, and when to surf and not to surf',
      button: 'Read the Surf Field Guide',
    },

    // ---- the t&c and the fine print at the very bottom
    terms: {
      title: 'Disclaimer',
      paragraph1:
        'Everything on CanISurfThere is an **estimate**. Waves, wind, tides and temperatures come from computer ' +
        'prediction models, and models are sometimes wrong. The ocean can change in minutes, and a number on a screen can ' +
        'never see a rip current, a new sandbar or a storm that just formed.',
      paragraph2:
        'Treat the meter as an asset, not as a definitive go-ahead. This meter does not replace a lifeguard, a caution sign ' +
        'at the beach, or even your own instinct for that matter. If you are unsure about the current, please **stay out of the water**.',
      finePrint1:
        '© 2026 Krishiv Chhabria. The CanISurfThere name, design, scoring method and calculated safety scores belong to Krishiv Chhabria. All rights reserved. Contact krchhabria@ucsd.edu for support.',
      finePrint2:
        'Underlying weather, wave, tide and alert data come from Open-Meteo, NOAA and the National Weather Service and remain the property of those sources.',
    },
  },

  // which menu to show on every page: 'bar' = a navigation bar across the top, 'wave' = the round wave button in the top right
  navStyle: 'wave',

  // ============================================================ the wave menu button (top right of every page)
  // keep the four links in this order. "label" is the big word and "note" is the small line under it.
  menu: {
    brand: 'CanISurfThere', // the name on the left of the top bar
    buttonLabel: 'Open the menu',
    links: [
      { label: 'Home', note: 'the beach' },
      { label: 'Surf Checker', note: 'can I surf right now?' },
      { label: 'Surf Field Guide', note: 'learn the basics' },
      { label: 'T&C', note: '' }, // (no small line under this one)
    ],
  },

  // ============================================================ the surf checker (the "/check" page)
  // note: the words inside the cards and verdicts (like "wave height" or "ideal") come from the server,
  // in server/safety.js. see text-guide.md.
  checker: {
    backLink: 'CanISurfThere', // top left link
    previousBeach: 'Previous beach', // (screen reader labels for the two arrow buttons)
    nextBeach: 'Next beach',
    refresh: 'Refresh',
    refreshing: 'Checking...',
    loadingBeaches: 'Loading beaches...',
    loadingReport: 'Reading the ocean...',
    serverDown: 'Cannot reach the CanISurfThere server. Make sure it is running (npm run dev).',
    tryAgain: 'Press Refresh to try again.',
    meterEnds: { low: 'Avoid', high: 'Ideal' }, // the words at the two ends of the meter
    nightAlert: '**It is unadvisable to surf at night.**', // the warning shown when the sun is down
    nightAlertDetail: 'The score reflects lower right now because it is night.',
    wetsuitLabel: 'What to wear:',
    watchOutsTitle: 'What is holding the score down',
    updated: 'Updated {time}, beach time. Press Refresh for the newest data.',
    missing: 'Could not load: {list}. The score uses what we could get.',
    // friendly names used in the "could not load" sentence
    sourceNames: {
      waves: 'wave data',
      weather: 'weather (wind, sky, sun)',
      tides: 'tides',
      waterTemp: 'live water temperature (using an estimate instead)',
      alerts: 'official warnings',
    },
    disclaimer:
      'This score is an estimate from public data (Open-Meteo, NOAA, National Weather Service). It is not a lifeguard. ' +
      'Always check the posted flags and ask a lifeguard before you go in the water.',
    guideBefore: 'New to surfing?',
    guideLink: 'Read the Surf Field Guide',
    guideAfter: 'to learn what every number means.',
    // the two headings inside the beach dropdown
    beachGroups: { yours: 'Your top spots', popular: 'Most popular beaches in the USA' },
  },
};
