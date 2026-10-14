// every beach lives in this one file.
// to add a beach: copy a block, change the numbers, save. that is it.
//
// id       = short name used in the url (no spaces)
// group    = "yours" shows up first in the dropdown, "popular" shows up second
// lat, lon = the beach itself (used for weather and alerts)
// sea      = a spot out in the water. the wave model only has data over ocean, not sand
// faces    = which way the beach looks out to sea, in compass degrees (0 = north, 90 = east, 180 = south, 270 = west)
// station  = noaa tide station id (find more at tidesandcurrents.noaa.gov)

export const beaches = [
  // ---- the three spots picked by the owner ----
  { id: 'windansea', name: 'Windansea Beach', city: 'La Jolla', state: 'CA', group: 'yours',
    lat: 32.8300, lon: -117.2810, sea: [32.83, -117.34], faces: 260, station: '9410230' },
  { id: 'blacks', name: "Black's Beach", city: 'La Jolla', state: 'CA', group: 'yours',
    lat: 32.8886, lon: -117.2530, sea: [32.89, -117.32], faces: 270, station: '9410230' },
  { id: 'la-jolla-shores', name: 'La Jolla Shores', city: 'La Jolla', state: 'CA', group: 'yours',
    lat: 32.8570, lon: -117.2570, sea: [32.86, -117.32], faces: 285, station: '9410230' },

  // ---- ten popular beaches around the usa ----
  { id: 'waikiki', name: 'Waikiki Beach', city: 'Honolulu', state: 'HI', group: 'popular',
    lat: 21.2766, lon: -157.8270, sea: [21.23, -157.83], faces: 180, station: '1612340' },
  { id: 'south-beach', name: 'South Beach', city: 'Miami Beach', state: 'FL', group: 'popular',
    lat: 25.7826, lon: -80.1300, sea: [25.78, -80.07], faces: 90, station: '8723214' },
  { id: 'huntington', name: 'Huntington Beach', city: 'Huntington Beach', state: 'CA', group: 'popular',
    lat: 33.6595, lon: -118.0010, sea: [33.62, -118.04], faces: 225, station: '9410660' },
  { id: 'santa-monica', name: 'Santa Monica Beach', city: 'Santa Monica', state: 'CA', group: 'popular',
    lat: 34.0100, lon: -118.4960, sea: [33.97, -118.55], faces: 255, station: '9410840' },
  { id: 'venice', name: 'Venice Beach', city: 'Los Angeles', state: 'CA', group: 'popular',
    lat: 33.9850, lon: -118.4720, sea: [33.95, -118.53], faces: 250, station: '9410840' },
  { id: 'myrtle', name: 'Myrtle Beach', city: 'Myrtle Beach', state: 'SC', group: 'popular',
    lat: 33.6891, lon: -78.8867, sea: [33.66, -78.83], faces: 100, station: '8661070' },
  { id: 'virginia-beach', name: 'Virginia Beach', city: 'Virginia Beach', state: 'VA', group: 'popular',
    lat: 36.8529, lon: -75.9780, sea: [36.85, -75.92], faces: 70, station: '8638863' },
  { id: 'daytona', name: 'Daytona Beach', city: 'Daytona Beach', state: 'FL', group: 'popular',
    lat: 29.2108, lon: -81.0228, sea: [29.21, -80.96], faces: 90, station: '8721604' },
  { id: 'cocoa', name: 'Cocoa Beach', city: 'Cocoa Beach', state: 'FL', group: 'popular',
    lat: 28.3200, lon: -80.6076, sea: [28.32, -80.55], faces: 95, station: '8721604' },
  { id: 'nags-head', name: 'Nags Head (Outer Banks)', city: 'Nags Head', state: 'NC', group: 'popular',
    lat: 35.9574, lon: -75.6241, sea: [35.96, -75.56], faces: 90, station: '8651370' },
];
