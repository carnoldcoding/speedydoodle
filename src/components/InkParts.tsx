// The two layers that make an ink box: the outline that can draw itself, and the fill.
// Use it as the first child of an element with the class "ink-box", and put the content
// in an element with the class "ink-in".
export function InkParts({ radius }: { radius?: number }) {
  return (
    <>
      <svg className="ink-line" aria-hidden="true">
        <rect width="100%" height="100%" pathLength={1} rx={radius} />
      </svg>
      <i className="ink-fill" aria-hidden="true" />
    </>
  );
}
