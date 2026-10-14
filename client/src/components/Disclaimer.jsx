// the disclaimer (also the "t&c" part of the page) and the fine print in navy blue.
// it is kept short on purpose: wide and low instead of tall. the words come from data/sitetext.js.
import { TriangleAlert } from 'lucide-react';
import Rich from './Rich.jsx';
import { siteText } from '../data/siteText';

const terms = siteText.landing.terms;

export default function Disclaimer() {
  return (
    <>
      {/* id="terms" is what the t&c link in the wave menu scrolls to */}
      <section className="disclaimer-section" id="terms">
        <div className="terms-inner">
          <div className="terms-head">
            <TriangleAlert size={34} className="disclaimer-icon" />
            <h2>{terms.title}</h2>
          </div>
          <p><Rich text={terms.paragraph1} /></p>
          <p><Rich text={terms.paragraph2} /></p>
        </div>
      </section>

      <footer className="fine-print">
        <p><Rich text={terms.finePrint1} /></p>
        <p><Rich text={terms.finePrint2} /></p>
      </footer>
    </>
  );
}
