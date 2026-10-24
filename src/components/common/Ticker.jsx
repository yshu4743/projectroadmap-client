export default function Ticker({ items, variant = 'dark', reverse = false }) {
  const doubled = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className={`ticker overflow-hidden ${variant === 'accent' ? 'ticker--accent' : ''} ${
        reverse ? 'ticker--reverse' : ''
      }`}
    >
      <div className="ticker__track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}