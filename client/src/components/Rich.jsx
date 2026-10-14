// rich.jsx
// shows text, and does two small tricks:
//   1. **two stars** around words make them bold
//   2. an email address becomes a clickable mailto link
// this is what lets sitetext.js hold bold text and links without any html in it.
const emailPattern = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/;

export default function Rich({ text }) {
  return text.split('**').map((part, i) => {
    // split each piece again around email addresses
    const pieces = part.split(emailPattern).map((piece, j) =>
      emailPattern.test(piece) ? <a key={j} href={`mailto:${piece}`}>{piece}</a> : piece
    );
    return i % 2 === 1 ? <strong key={i}>{pieces}</strong> : <span key={i}>{pieces}</span>;
  });
}
