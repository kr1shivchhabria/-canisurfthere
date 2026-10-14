// the checker page: pick a beach, press refresh, read the meter.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, Shirt, TriangleAlert } from 'lucide-react';
import BeachPicker from '../components/BeachPicker.jsx';
import SurfMeter from '../components/SurfMeter.jsx';
import StatCard from '../components/StatCard.jsx';
import OceanCanvas from '../components/OceanCanvas.jsx';
import CountUp from '../components/CountUp.jsx';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { scoreColor } from '../lib/scoreColor';
import Rich from '../components/Rich.jsx';
import { siteText } from '../data/siteText';
import '../styles/checker.css';

// all the words on this page come from data/sitetext.js
const t = siteText.checker;
const sourceNames = t.sourceNames; // friendly names for the "could not load" note

export default function Checker() {
  const [beaches, setBeaches] = useState([]); // the dropdown list
  const [selectedId, setSelectedId] = useState(localStorage.getItem('canisurfthere-beach') || '');
  const [data, setData] = useState(null); // the latest report
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const page = useRef(null);
  const latestRequest = useRef(0); // used to ignore old answers if you click quickly

  // ---- step 1: get the list of beaches once ----
  useEffect(() => {
    fetch('/api/beaches')
      .then((res) => res.json())
      .then((list) => {
        setBeaches(list);
        // if nothing is saved (or the saved beach is gone), start with the first one
        setSelectedId((current) => (list.some((b) => b.id === current) ? current : list[0].id));
      })
      .catch(() => setError(t.serverDown));
  }, []);

  // ---- step 2: get the surf report for one beach ----
  const load = useCallback(async (id) => {
    if (!id) return;
    const requestNumber = ++latestRequest.current;
    setLoading(true);
    setError('');
    try {
      // the ?t= part is just a changing number so the browser never reuses an old answer
      const res = await fetch(`/api/surf/${id}?t=${Date.now()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      if (requestNumber === latestRequest.current) setData(json); // only keep the newest answer
    } catch (err) {
      if (requestNumber === latestRequest.current) setError(err.message === 'Failed to fetch' ? t.serverDown : err.message);
    } finally {
      if (requestNumber === latestRequest.current) setLoading(false);
    }
  }, []);

  // whenever the chosen beach changes: remember it and load its report
  useEffect(() => {
    if (!selectedId) return;
    localStorage.setItem('canisurfthere-beach', selectedId);
    load(selectedId);
  }, [selectedId, load]);

  // when new data arrives, the cards pop in one after another
  useEffect(() => {
    if (!data || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.stat-card', { y: 18, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out', clearProps: 'all' });
    }, page);
    return () => ctx.revert();
  }, [data?.fetchedAt]);

  // the arrow buttons: go to the previous or next beach in the list (wraps around)
  const step = (direction) => {
    const index = beaches.findIndex((b) => b.id === selectedId);
    const next = (index + direction + beaches.length) % beaches.length;
    setSelectedId(beaches[next].id);
  };

  const safety = data?.safety;
  const missing = data ? Object.keys(data.sources).filter((key) => !data.sources[key]) : [];
  const updatedAt = data
    ? new Date(data.fetchedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: data.timezone })
    : null;

  return (
    <div className={`check-page ${loading ? 'is-loading' : ''}`} ref={page}>
      {/* a calm, flowing ocean fixed behind the whole page */}
      <div className="check-bg">
        <OceanCanvas palette="sky" speed={0.7} crests={9} />
      </div>

      {/* ---------- top bar ---------- */}
      <header className="topbar">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          {t.backLink}
        </Link>

        <div className="controls">
          <button className="icon-button" onClick={() => step(-1)} aria-label={t.previousBeach} disabled={!beaches.length}>
            <ChevronLeft size={22} />
          </button>
          <BeachPicker beaches={beaches} selectedId={selectedId} onChange={setSelectedId} />
          <button className="icon-button" onClick={() => step(1)} aria-label={t.nextBeach} disabled={!beaches.length}>
            <ChevronRight size={22} />
          </button>

          {/* the manual refresh button */}
          <button className="refresh-button" onClick={() => load(selectedId)} disabled={loading || !selectedId}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            {loading ? t.refreshing : t.refresh}
          </button>
        </div>
      </header>

      <main className="check-main">
        {/* ---------- error message ---------- */}
        {error && (
          <div className="notice error" role="alert">
            <TriangleAlert size={20} />
            <p>{error} {t.tryAgain}</p>
          </div>
        )}

        {/* ---------- first load ---------- */}
        {!safety && !error && <p className="loading-text">{t.loadingReport}</p>}

        {safety && (
          <>
            {/* ---------- the main meter ---------- */}
            <section className="meter-card">
              <div className="meter-left">
                <h1>{data.beach.name}</h1>
                <p className="meter-place">{data.beach.city}, {data.beach.state}</p>
                <SurfMeter score={safety.score} />
                <p className="meter-readout" style={{ color: scoreColor(safety.score) }}>
                  <span className="meter-score"><CountUp to={safety.score} /></span>
                  <span className="meter-outof">/100</span>
                </p>
                <p className="meter-label" style={{ color: scoreColor(safety.score) }}>{safety.label}</p>
              </div>

              <div className="meter-right">
                <p className="verdict">{safety.verdict}</p>

                {/* when it is dark, say why the score dropped (same style as the official warnings) */}
                {safety.isNight && (
                  <div className="notice warn">
                    <TriangleAlert size={20} />
                    <p><Rich text={t.nightAlert} /> {t.nightAlertDetail}</p>
                  </div>
                )}

                {/* official warnings, if there are any */}
                {safety.alerts.map((a) => (
                  <div className="notice warn" key={a.event}>
                    <TriangleAlert size={20} />
                    <p><strong>{a.event}.</strong> {a.headline}</p>
                  </div>
                ))}

                {safety.wetsuit && (
                  <p className="wetsuit">
                    <Shirt size={18} />
                    {t.wetsuitLabel} {safety.wetsuit}
                  </p>
                )}

                {safety.watchOuts.length > 0 && (
                  <div className="watchouts">
                    <h2>{t.watchOutsTitle}</h2>
                    <ul>
                      {safety.watchOuts.map((text) => <li key={text}>{text}</li>)}
                    </ul>
                  </div>
                )}

                <p className="updated">{t.updated.replace('{time}', updatedAt)}</p>
              </div>
            </section>

            {/* some data sources might have failed */}
            {missing.length > 0 && (
              <div className="notice info">
                <p>{t.missing.replace('{list}', missing.map((m) => sourceNames[m]).join(', '))}</p>
              </div>
            )}

            {/* ---------- all the details ---------- */}
            <section className="cards">
              {safety.factors.map((factor) => <StatCard key={factor.id} factor={factor} />)}
            </section>

            <p className="disclaimer">{t.disclaimer}</p>
            <p className="guide-link">
              {t.guideBefore} <Link to="/learn">{t.guideLink}</Link> {t.guideAfter}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
