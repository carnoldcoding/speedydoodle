# Spec: Phone first screen and one speech bubble

Status: accepted 2026-11-24

Repo: `speedydoodle` (the frontend). No change to `speedydoodle-backend`.
Terms: see `CONTEXT.md`.
Reference picture: Mike's mockup of 2026-11-17, to be saved as
`docs/design-studies/img/phone-first-screen-mockup.jpg`.
Related spec: `docs/specs/site-redesign.md` ("the redesign spec"). This spec replaces parts
of its requirements H2, H3, H5, M2, and P1. The section "Replaced requirements" lists them.

## Intent

Mike, the artist and the owner of the business, read the released site on his phone. His
words:

- "I like the way the website looks on the desktop computer, but on mobile all you see on
  the very first screen when you get there is a lot of text."
- "Can we just rearrange some of the elements so that the first thing you see is more than
  just text?"
- "Not sure we need a 'quote' button at every stage. Maybe save that for the end."
- "Also not sure we need a 'see our work' button since the 'gallery' button at the top takes
  you to the same place."
- "Can you make the image clickable to take them to the samples instead of having a button?
  I think most people know to click on the image."
- "Shrink up the word balloons. I feel like one should suffice and just have the content
  inside change, either by fading in and out or sliding to the left."

## Scope

In:

- The phone layout of the bar at the top of each page.
- The phone layout of the hero of the home page.
- The buttons of the three service panels of the home page, at each width.
- The customer quotes of the home page, at each width.
- The motion timing sheet, the build check script, and the notes in the redesign spec.

Out:

- The wide layout of the bar and of the hero. They stay as they are.
- The gallery page and the quote form, apart from the bar.
- The words of the site. No sentence changes.
- The admin panel and the backend.
- A swipe for the speech bubble.

## Requirements

### The bar, phone layout

- R1. The bar shows three links in one centered row, in this order: Gallery, Home, Services.
  A thin vertical line in logo yellow is between each two links.
- R2. The bar shows no logo.
- R3. The bar is the same on each page of the site: the home page, the gallery, the quote
  form, and the "page not found" page.
- R4. The bar stays at the top of the screen while the page scrolls, as it does today.
- R5. The link of the current page has the bright accent colour, as it does today.
- R6. The area that reacts to a press is 44 pixels high or more for each link.
- R7. The order of the links in the HTML stays Home, Gallery, Services. A screen reader and
  the Tab key use that order.

### The hero of the home page, phone layout

- R8. The hero shows these parts from the top: the logo, the band, the hero artwork, the hero
  sentence.
- R9. The logo is centered and takes approximately 80% of the width of the screen. It is a
  link to the home page. It is sharp on a screen with 3 device pixels for each pixel.
- R10. The band is as wide as the screen. Its background is the accent colour `#b42401`. Its
  text is "South Jersey • Philadelphia • Delaware" in the comic font, in logo yellow, on one
  line.
- R11. The contrast between the band text and the band background is 4.5 to 1 or more.
- R12. The hero artwork is as wide as the screen less the page margins.
- R13. The hero shows no headline in text, no "Caricature artist" line, and no button.
- R14. The hero sentence ("Here at Speedydoodle Studios, we turn weddings ...") is below the
  hero artwork.
- R15. On a screen of 393 by 659 pixels and on a screen of 375 by 548 pixels, the bar, the
  logo, the band, and the full hero artwork are visible with no scroll.
- R16. The entrance runs at page load, in this order: the logo, the band, the hero artwork,
  the hero sentence. Each part uses an animation that the motion timing sheet already has.
- R17. The HTML of the home page has one `h1`. Its text and its accessible name are the same
  as today at each width: they hold "Caricature artist", the three areas, and "Speedydoodle
  Studios". In the phone layout, the words that are not in the band are hidden from view and
  not from a screen reader.

### The hero of the home page, wide layout

- R18. Nothing changes: the logo in the bar, the order of the links, the headline, the
  sentence, the two buttons, and the hero artwork.

### The three service panels, each width

- R19. The picture of each panel is a link to the gallery category of that panel: `/gallery/party`,
  `/gallery/custom`, `/gallery/logos`.
- R20. The accessible name of that link is "See our work:" and the title of the panel.
- R21. The "See the work" button is removed from each panel.
- R22. Each panel keeps one "Get a quote" button. It opens the quote form with the type of
  that panel chosen.
- R23. The "See the full gallery" button of the section "Our work" and the "Get a quote"
  button of the last section stay.

### The speech bubble, each width

- R24. The proof section shows one speech bubble, not three.
- R25. The bubble shows each testimonial of the site, one at a time, in the order of the
  admin panel. The first testimonial shows first. After the last, the first shows again.
- R26. A testimonial stays for 2 seconds plus 40 milliseconds for each character of its text.
- R27. The change is a fade: the old text goes out in 200 milliseconds, then the new text
  comes in in 200 milliseconds. The outline, the shadow, and the tail of the bubble do not
  move.
- R28. The bubble is as high as its longest testimonial needs at the current width. A change
  moves nothing on the page.
- R29. A row of dots is below the bubble, one dot for each testimonial. The dot of the
  visible testimonial is marked. The area that reacts to a press is 44 by 44 pixels for each
  dot. The row goes to a second line when it does not fit.
- R30. A press on a dot shows its testimonial at once. After that press, the bubble does not
  change by itself until the page loads again.
- R31. The bubble does not change by itself in these conditions: before the proof section
  has entered the screen, while the bubble is off the screen, while the browser tab is
  hidden, while the pointer is over the bubble, and while the keyboard focus is in the
  bubble or its dots.
- R32. With the device set to "reduce motion", the bubble does not change by itself, and a
  press on a dot changes the text with no fade.
- R33. Each dot is a button with the accessible name "Quote from" and the name of the
  customer. A screen reader reads only the visible testimonial. A change by itself is not
  announced.
- R34. The built HTML of the home page holds the text and the name of each testimonial.
- R35. With JavaScript turned off, each testimonial shows in its own bubble, one below the
  other, and no dots show.
- R36. With one testimonial, the bubble shows it with no dots and no change. With no
  testimonial, the proof section shows the number of years only.
- R37. The bubble enters one time with the draw effect of a box, as a speech bubble does
  today.

### Files that record the design

- R38. `npm run images` makes a logo copy of 908 pixels wide. No picture file of the site is
  larger than 200 KB.
- R39. `docs/motion.md` has a row for the fade of the bubble and for each part of the phone
  hero. Its rule "Nothing loops" names the bubble as the one exception.
- R40. `scripts/check-build.mjs` checks R19, R21, R22, and R34 on the built home page.
- R41. In the redesign spec, each replaced requirement gets one line that names this spec.
- R42. The mockup is saved at the path given at the top of this spec.

## Replaced requirements

| Redesign spec | It said | Now |
|---|---|---|
| H2 (hero parts) | Artwork, name, area, one sentence, two buttons | Wide layout: the same. Phone layout: R8 to R14 |
| H3 (service panels) | Two buttons for each panel | One button, and the picture is the link (R19 to R22) |
| H5 (proof) | Three customer quotes in speech bubbles | One bubble that shows each testimonial (R24 to R37) |
| M2 (motion) | Nothing loops | The bubble is the one exception (R25) |
| P1 (path to a quote) | The hero offers a quote in one press | Wide layout: the same. Phone layout: the first quote button is in the first service panel |

## Decisions

The owner of the repo told the author on 2026-11-24 to decide each point. The author made
each decision below.

- D1 (widths). The new first screen applies below 768 pixels only. That is the width where
  the hero already changes from one column to two. In two columns the artwork is next to the
  text, so Mike's complaint does not apply, and he likes the desktop page. Rejected: the new
  hero at each width.
- D2 (the bar on other pages). The phone bar is the same on each page. Rejected: the new bar
  on the home page only. The bar stays on the screen, so links that change position between
  pages cause wrong presses. Result: in the phone layout, the gallery and the quote form show
  no logo. The footer keeps the business name.
- D3 (order of the links). The new order applies to the phone layout only, and the HTML
  order does not change. Rejected: the new order at each width, because the wide layout has
  the logo at the left as the home link.
- D4 (headline). The text headline is hidden from view in the phone layout and stays in the
  HTML. Rejected: removal. A search engine reads the main heading, and the build check E3
  (main heading names caricatures and the area) needs it.
- D5 (hero sentence). The sentence moves below the artwork in the phone layout. Rejected:
  removal in the phone layout. It is the one sentence that says what the studio does, and
  Google reads the phone layout of a page first.
- D6 (logo yellow). The band text and the lines in the bar use logo yellow, as in the
  mockup. The artistic feel allows one accent colour. The yellow is a colour of the artwork,
  and it shows only next to the logo, so the rule holds. No other part uses it.
- D7 (band background). The accent colour `#b42401`, not the brighter red of the mockup. The
  brighter red gives too little contrast with yellow text of this size.
- D8 (hero buttons). The phone hero has no button. The wide hero keeps its two buttons.
- D9 (quote buttons). One "Get a quote" button stays in each service panel. Mike proposed
  one button at the end of the page only. Rejected, for three reasons. The page is long on a
  phone. The bar has no quote link. Each panel button opens the form with the correct type
  chosen, which the button at the end cannot do. The count of quote buttons goes from five
  to four in the phone layout.
- D10 (picture as the link). At each width, because the panel is one component and the
  picture is the implied link. The gallery pictures of the section "Our work" already work
  this way.
- D11 (one bubble). At each width. Mike's comment was about the site, not about the phone.
- D12 (fade). A fade, not a slide. A slide looks like a thing to swipe, and a swipe is out
  of scope.
- D13 (each testimonial). The bubble shows each testimonial, not the first three. The site
  has seven today. The admin panel sets the order.
- D14 (time for each testimonial). The time depends on the length. The testimonials today
  are 109 to 296 characters. The rule gives 6.4 seconds to the shortest and 13.8 seconds to
  the longest. Rejected: one fixed time, which is too short for the longest or too long for
  the shortest.
- D15 (the stop). Dots that stop the change after a press. Text that changes by itself for
  more than 5 seconds needs a way to stop it: Web Content Accessibility Guidelines (WCAG)
  2.2, success criterion 2.2.2 (pause, stop, hide). Rejected: a pause button, which is a
  second control for the same job.
- D16 (fixed height). The bubble takes the height of its longest testimonial. Rejected: a
  height that follows the text, because the last section then moves at each change.
- D17 (service panels in the mockup). The mockup shows no "What we offer" heading and puts
  the title "Live events" above its picture. This spec keeps the heading and the order of the
  panel. The mockup is a paste of parts, and Mike's notes do not ask for this change.
- D18 (red line). The red line below the artwork in the mockup is not built. Mike's notes do
  not name it.

## Open questions

None.

## Acceptance checks

Checks by a program. Each one runs on the built site, after `npm run build`.

- `npm run typecheck` reports no error. `npm run test` reports no failed test.
- `npm run check` reports 0 failed. It includes the checks that exist today, with E3 (one
  `h1` that holds "Caricature", "South Jersey", "Philadelphia", "Delaware") and F3 (the hero
  sentence and "consummate professional" are in the HTML). (R17, R14, R34)
- New check: in the HTML of the home page, the picture of each service panel is inside a
  link to `/gallery/party`, `/gallery/custom`, or `/gallery/logos`. A pass is three such
  links. (R19)
- New check: the HTML of the home page does not hold the words "See the work". (R21)
- New check: the HTML of the home page holds three links to the quote form with a type
  chosen, one for each panel. (R22)
- New check: the count of `blockquote` elements in the HTML of the home page is the count of
  testimonials that `https://api.speedydoodle.com/api/content` returns. (R34)
- New check: `src/assets/web/logo-908.webp` exists and is 200 KB or less. (R38)
- `grep "Nothing loops" docs/motion.md` shows the rule with the exception. (R39)

Checks by a person, on an iPhone in Safari, on the Netlify preview of the release pull
request. The author does not make screenshots.

- The home page, at the top, with no scroll: the bar with three centered links and no logo,
  the logo, the band, and the full hero artwork are visible. No headline and no button are
  visible. A pass is a match with the mockup for these parts. (R1, R2, R8 to R13, R15)
- A press on the logo, and a press on each link of the bar, opens the correct page. The bar
  looks the same on the gallery and on the quote form. (R3, R5, R6, R9)
- The hero sentence is below the artwork. (R14)
- A press on the picture of each service panel opens its gallery category. Each panel has
  one button, and it opens the quote form with the correct type chosen. (R19 to R22)
- The speech bubble: the text changes by a fade, a long testimonial stays longer than a
  short one, and the last section does not move at a change. (R24 to R28)
- A press on a dot shows its testimonial. After 30 seconds, the same testimonial still
  shows. (R29, R30)
- With "reduce motion" on in the iPhone settings, the bubble does not change in 30 seconds.
  (R32)

Checks by a person, on a computer, at a window 1280 pixels wide.

- The bar and the hero look the same as the released site at `https://speedydoodle.com`.
  (R18)
- With JavaScript turned off in the browser, the home page shows seven speech bubbles and no
  dots. (R35)
- The Tab key reaches the dots, and a press on Enter shows the testimonial of the dot.
  (R31, R33)
