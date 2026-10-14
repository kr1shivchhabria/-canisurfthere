// animated 3d sky and clouds from vanta.js. used on the field guide page.
// (the landing page uses our own canvas ocean instead, see oceancanvas.jsx)
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';

export default function VantaClouds() {
  const box = useRef(null);

  useEffect(() => {
    let effect;
    try {
      // these options change how the sky looks. try changing the colors!
      effect = CLOUDS({
        el: box.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        skyColor: 0x4fb4ea, // our sky blue
        cloudColor: 0xe9f6fd, // white clouds
        cloudShadowColor: 0x2a6f9e, // bluish shadows under the clouds
        sunColor: 0xf6c84c, // warm sun
        sunGlareColor: 0xf0a860,
        sunlightColor: 0xf7d9a0,
        speed: 0.9,
      });
    } catch (err) {
      // if webgl does not work, the css gradient behind it still looks fine
      console.log('vanta could not start, using the plain background', err);
    }
    // stop the animation when this component leaves the screen
    return () => effect && effect.destroy();
  }, []);

  return <div className="vanta-clouds" ref={box} />;
}
