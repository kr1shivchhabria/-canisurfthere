// learnprompt.jsx
// the "one more page" prompt that leads to the field guide.
// it sits on its own patch of ocean. the sand fades into water at the top, a little surfer rides across,
// and the content is pinned for a moment (the scroll hold). the words come from data/sitetext.js.
import { Link } from 'react-router-dom';
import MagnetButton from './MagnetButton.jsx';
import OceanCanvas from './OceanCanvas.jsx';
import Bubbles from './Bubbles.jsx';
import Rich from './Rich.jsx';
import { Surfer } from './Decorations.jsx';
import { siteText } from '../data/siteText';

const prompt = siteText.landing.guidePrompt;

export default function LearnPrompt() {
  return (
    <section className="guide-ocean">
      <div className="guide-bg">
        <OceanCanvas palette="lagoon" speed={0.8} crests={10} />
      </div>
      {/* the sand color fades into the water at the top, and the water deepens into dark blue at the bottom */}
      <div className="guide-fade-top" />
      <div className="guide-fade-bottom" />
      {/* a quick burst of bubbles rising out of the water into the sand, only in the band between the two */}
      <Bubbles count={74} className="bubbles-guide" duration={[2.4, 5.6]} size={[6, 34]} />

      <div className="guide-pin">
        {/* a small surfer riding across the water */}
        <div className="surfer" aria-hidden="true">
          <div className="surfer-bob">
            <Surfer />
          </div>
        </div>

        <p className="hand prompt-hand">{prompt.note}</p>
        <h2 className="guide-heading"><Rich text={prompt.title} /></h2>
        <p className="prompt-text">{prompt.text}</p>
        <MagnetButton>
          <Link to="/learn" className="prompt-button">{prompt.button}</Link>
        </MagnetButton>
      </div>
    </section>
  );
}
