/**
 * Hadassah 31 mark: a wine petal-blob with a cream flower. Drawn inline so it
 * renders with no image request (offline, any host). index.html uses the same
 * drawing as its favicon — keep the two in sync if the mark changes.
 */
export function BrandMark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 64 64">
      <ellipse cx="32" cy="32" fill="#3b071e" rx="25" ry="28" transform="rotate(-8 32 32)" />
      <g
        fill="none"
        stroke="#f4ebdf"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        transform="translate(12.8 12.8) scale(1.6)"
      >
        <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1" />
        <circle cx="12" cy="8" r="2" />
        <path d="M12 10v12" />
        <path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z" />
        <path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z" />
      </g>
    </svg>
  );
}
