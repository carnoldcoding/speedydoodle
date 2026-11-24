// The timing of the speech bubble on the home page, which shows one testimonial at a time.

// How long the old text takes to go out, and then the new text to come in, in milliseconds.
// The style sheet uses the same value: see `.quote-words` in app.css.
export const FADE_TIME = 200;

// How long a testimonial stays before the next one shows, in milliseconds: 2 seconds plus
// 40 milliseconds for each character. A long testimonial needs more time to read.
export const stayTime = (text: string) => 2000 + 40 * [...text].length;

// The testimonial that shows after the one at `index`. After the last, the first shows again.
export const nextQuote = (index: number, count: number) => (count > 1 ? (index + 1) % count : 0);
