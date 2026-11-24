# Motion timing sheet

Each animation of the site, with its duration, its delay, and its easing. The keyframes are in
`src/app.css`. Change a value here and in the style sheet together.

Easing names used below:

| Name | Value | Feel |
|---|---|---|
| bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Passes the end value by a few percent, then settles |
| pen | `cubic-bezier(0.65, 0, 0.35, 1)` | Slow start, slow end, as a line drawn by hand |
| quick-out | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Fast start, soft end |
| quick-in | `cubic-bezier(0.4, 0, 1, 1)` | Soft start, fast end, for a part that leaves |

## Rules

- Each part moves one time, when it enters the screen. Nothing loops. The one exception is the
  speech bubble of the home page, which shows its testimonials one after another.
- No movement is longer than 400 ms. The one exception is a picture that takes its colour, at 700 ms.
- A press reacts in 100 ms.
- Motion never delays an action. A part can be pressed while it arrives.
- A long list of similar parts gets the draw effect for its first screen only. Later parts fade in.
- With "reduce motion" on, nothing moves, and each part shows finished.

## The entrance of a section

A section starts when 20% of it is on the screen. The first screen of a page starts at page load.
The parts of a section start one after another. `--d` is the delay of a part: its order in the
section, times 90 ms.

| Part | Keyframes | Duration | Delay | Easing |
|---|---|---|---|---|
| Text, a price, a number | `pop` (opacity 0 to 1, scale 0.6 to 1) | 320 ms | `--d` | bounce |
| Title, each letter | `pop` | 260 ms | `--d` + 22 ms for each letter | bounce |
| Ink line under a word | `draw` | 320 ms | `--d` + 560 ms | `cubic-bezier(0.3, 0.7, 0.3, 1)` |
| Pen circle around a number | `draw` | 400 ms | `--d` + 320 ms | pen |
| Dot pattern of the section | `fade` | 400 ms | 0 | ease-out |
| Box: the outline | `draw` | 380 ms | `--d` | pen |
| Box: the fill | `fade` | 160 ms | `--d` + 230 ms | ease-out |
| Box: the content | `pop` | 240 ms | `--d` + 260 ms | bounce |
| Box: the hard shadow | `shadow-land` | 150 ms | `--d` + 380 ms | bounce |
| Speech bubble: the tail | `fade` | 120 ms | `--d` + 300 ms | ease-out |
| Picture panel: sketch to colour | `colour` (grey, high contrast, to normal) | 700 ms | `--d` + 480 ms | ease-out |
| Picture panel: the tilt | `tilt` (0 to the tilt of the panel) | 320 ms | `--d` + 420 ms | bounce |
| Hero artwork: the rise | `rise` (40 px up, opacity 0 to 1) | 400 ms | `--d` | quick-out |
| Hero artwork: sketch to colour | `colour` | 700 ms | `--d` + 300 ms | ease-out |

A box is a button, a picture panel, or a speech bubble: a thing with an ink outline.

## The hero of the home page, phone layout

Below 768 pixels, the hero has four parts, and they start at page load in this order. The
headline and the buttons do not show, so they have no entrance.

| Part | Keyframes | Duration | Delay | Easing |
|---|---|---|---|---|
| Logo | `pop` | 320 ms | 0 | bounce |
| Band | `pop` | 320 ms | 90 ms | bounce |
| Hero artwork: the rise | `rise` | 400 ms | 180 ms | quick-out |
| Hero artwork: sketch to colour | `colour` | 700 ms | 480 ms | ease-out |
| Hero sentence | `pop` | 320 ms | 270 ms | bounce |

In the wide layout, the same line of text is the kicker above the headline, and its delay is 0.

## The speech bubble of the home page

The bubble enters one time as a box. After that, only its words change. The outline, the
shadow, and the tail do not move, and the bubble keeps the height of its longest testimonial.
The values are also in `src/lib/quotes.ts`.

| Part | Change | Duration | Delay | Easing |
|---|---|---|---|---|
| Old words go out | transition (opacity 1 to 0) | 200 ms | 0 | ease-in |
| New words come in | transition (opacity 0 to 1) | 200 ms | 200 ms | ease-out |
| Row of dots, at the entrance of the section | `pop` | 320 ms | `--d` | bounce |

A testimonial stays for 2 seconds plus 40 ms for each character of its text. The wait starts
after the new words have come in.

The bubble does not change by itself in these conditions: before it is on the screen, while
the browser tab is hidden, while a mouse pointer is over it, while the keyboard focus is in
it, after a press on a dot, and with "reduce motion" on. With "reduce motion" on, a press on
a dot changes the words with no fade.

## Things a visitor presses

| Part | Change | Duration |
|---|---|---|
| Comic button, pointer over it | Moves 2 px up and to the left | 100 ms |
| Comic button, pressed | Moves 3 px down and to the right | 100 ms |
| Picture panel, pointer over it or focus | Tilt goes to 0, scale goes to 1.03 | 150 ms |
| Navigation link, pointer over it | Colour changes to the bright accent | 100 ms |
| Dot of the speech bubble, pointer over it | Scale goes to 1.25 | 100 ms |
| Dot of the speech bubble, its testimonial shows | Fills with the bright accent, scale 1.25 | 100 ms |

## Gallery

| Part | Keyframes | Duration | Delay | Easing |
|---|---|---|---|---|
| Panel on the first screen: the outline | `draw` | 380 ms | 60 ms for each panel before it | pen |
| Panel on the first screen: the picture appears | `fade` | 160 ms | + 230 ms | ease-out |
| Panel on the first screen: sketch to colour | `colour` | 700 ms | + 440 ms | ease-out |
| Panel on the first screen: the hard shadow | `shadow-land` | 150 ms | + 380 ms | bounce |
| Panel on the first screen: the tilt | `tilt` | 320 ms | + 420 ms | bounce |
| Panel that enters later by scroll | `fade` | 240 ms | 0 | ease-out |
| Panel of a gallery already seen | none: it shows finished | | | |
| Large view: the dark layer | `fade` | 140 ms | 0 | ease-out |
| Large view: the first picture | `pop` | 240 ms | 0 | bounce |
| Large view: a new picture slides in | `large-slide-in` (80 px from its side, opacity 0 to 1) | 240 ms | after the picture has loaded | quick-out |
| Large view: the old picture slides out | transition (110 px to the other side, opacity 1 to 0) | 180 ms | 0 | quick-in |
| Large view: return to the middle after a short drag | transition | 160 ms | 0 | quick-out |
| Burst | `pop` | 300 ms | 260 ms | bounce |

The large view uses no colour effect. A new picture loads in full before anything moves.

## Quote form

| Part | Keyframes | Duration | Delay | Easing |
|---|---|---|---|---|
| Each screen of the form | `pop-soft` (opacity 0 to 1, scale 0.92 to 1) | 220 ms | 0 | bounce |

No field of the form has an entrance of its own. The estimate changes with no animation.
