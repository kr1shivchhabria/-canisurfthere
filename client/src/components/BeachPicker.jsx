// a custom dropdown. we built our own (instead of a normal <select>)
// because we want a small subtitle with the city and state under each beach name.
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { siteText } from '../data/siteText';

// the two sections of the dropdown
const groups = [
  { key: 'yours', title: siteText.checker.beachGroups.yours },
  { key: 'popular', title: siteText.checker.beachGroups.popular },
];

export default function BeachPicker({ beaches, selectedId, onChange }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const selected = beaches.find((b) => b.id === selectedId);

  // close the menu when you click somewhere else or press escape
  useEffect(() => {
    const handleClick = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const pick = (id) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="picker" ref={box}>
      {/* the button you see when the menu is closed */}
      <button className="picker-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="listbox">
        <MapPin size={20} />
        <span className="picker-text">
          <span className="picker-name">{selected ? selected.name : siteText.checker.loadingBeaches}</span>
          {selected && <span className="picker-sub">{selected.city}, {selected.state}</span>}
        </span>
        <ChevronDown size={20} className={open ? 'flip' : ''} />
      </button>

      {/* the menu itself */}
      {open && (
        <div className="picker-menu" role="listbox">
          {groups.map((group) => (
            <div key={group.key}>
              <p className="picker-group">{group.title}</p>
              {beaches
                .filter((b) => b.group === group.key)
                .map((b) => (
                  <button
                    key={b.id}
                    role="option"
                    aria-selected={b.id === selectedId}
                    className={`picker-option ${b.id === selectedId ? 'active' : ''}`}
                    onClick={() => pick(b.id)}
                  >
                    <span className="picker-name">{b.name}</span>
                    <span className="picker-sub">{b.city}, {b.state}</span>
                  </button>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
