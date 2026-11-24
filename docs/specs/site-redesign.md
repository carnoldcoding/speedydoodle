# Spec: Speedydoodle site redesign

Status: accepted 2026-11-17

Repo: `speedydoodle` (the frontend). Section B changes `speedydoodle-backend`.
Terms: see `CONTEXT.md`. Studies: see `docs/design-studies/`.
Related spec: `speedydoodle-backend/docs/specs/infrastructure-and-admin.md` ("the first spec").

## Intent

The owner designed the site as a junior developer and sees much that is wrong at a glance. The
first pass is a redo of the whole site.

The design standard, in the owner's words: "beauty lies at the intersection of functionality
and form. I don't wish to sacrifice either." Keep "the artistic feel, and the intuitive UX".
Do not "overcomplicate the process for prospective purchasers, by adding unnecessary fluff".
Add flair: "quick/snappy animations that give the site a professional feel".

For each page: the gallery is "archaic" and must become "an experience ... that's less dull
and grabs people". Services must be "easily maneuverable for people of all ages and all
technical backgrounds". The front page is "a fusion between".

The site must convert: "we want to have good clickthrough, visits converted to purchases."
The search visibility "is garbage" because the pages are built in the browser, and a shared
link must show "much more beautiful messages". The words must be "friendly informal ... like
they're calling a friend to do a gig", and say "Mike", not "he".

## Scope

In:

- The look, the motion, and the words of the home page, the gallery, and the quote form.
- Pages built to real HTML at build time, for search engines and for link previews.
- An address for each drawing.
- Two small changes to the quote route on the server.

Out:

- The admin panel and the tailnet page. They are M3 and M4 of the first spec.
- Captions for drawings, and Mike's choice of his best drawings. They come with M3.
- Prices read from the database. They stay written in the frontend until M3.
- A Google Business Profile and Google Search Console. Only the owner can set them up.
- A light theme.

## Requirements

### Foundation

- F1. The site builds with React Router in framework mode, with pre-rendering and no runtime
  server. The output is static files, and Netlify serves them.
- F2. The build writes one HTML file for each of these addresses: `/`, `/gallery`,
  `/gallery/<category>` for each of the four categories, `/gallery/<category>/<drawing>` for
  each drawing, and `/services`.
- F3. Each HTML file holds the full text of its page. With JavaScript turned off in the
  browser, each word of the page is visible.
- F4. `/homepage` and `/about` redirect to `/` with status 301. An unknown address shows a
  "page not found" page with a link to the home page.
- F5. The source stays TypeScript, Tailwind CSS, and one theme file. `tsc --noEmit` reports
  no error.
- F6. No component reads the window size while it renders. The layout for a narrow screen
  comes from CSS.
- F7. The two fonts load from the site itself, not from a font service.

### Type, shape, and colour

- T1. Headings, the navigation, and buttons use Bangers, as the font is drawn, with its lean.
- T2. Paragraphs, form labels, and typed text use DM Sans. Inter is removed.
- T3. The dark background and the one accent colour, `#B42401`, stay. A brighter form of the
  accent is used for text on the dark background.
- S1. Buttons, picture panels, form fields, and the gallery choices have a thick white ink
  outline and a hard shadow with no blur. Each one moves up and to the left under a pointer,
  and down and to the right when pressed.
- S2. Picture panels have a small tilt. A panel straightens and grows under a pointer or
  focus. Form fields and text never tilt.
- S3. A customer quote is a white speech bubble with a black outline and a tail.
- S4. Sections have a faint dot pattern.
- S5. The reference for T1 to S4 is `docs/design-studies/shapes.html`, option B.

### Motion

- M1. The draw effect is level 4 of `docs/design-studies/motion-levels.html`: outlines draw
  themselves, the inside appears, the shadow lands, titles arrive letter by letter, an ink
  line draws under one word, a picture arrives as a grey sketch and takes its colour, a
  picture panel tips into its tilt, and a pen circles a key number.
- M2. Each part moves one time, when it enters the screen. Nothing loops.
  Replaced in part by `docs/specs/phone-first-screen.md`: the speech bubble is the one exception.
- M3. No movement is longer than 0.4 seconds. The one exception is a picture that takes its
  colour, at 0.7 seconds. A press reacts in 0.1 seconds.
- M4. Motion never delays an action. A visitor can press a button or type in a field while
  it arrives.
- M5. A long list of similar parts gets the draw effect for its first screen only. A part
  that enters later arrives finished, with a fade of 0.24 seconds.
- M6. With the device set to "reduce motion", nothing moves, and each part shows finished.
- M7. `docs/motion.md` lists each animation with its duration, its delay, and its easing.

### Home page

- H1. The home page has five sections in this order: hero, what Mike does, the work, proof,
  close. The reference is `docs/design-studies/home.html`.
- H2. Hero: the artwork, the business name, the service area, one sentence, and two buttons,
  "Get a quote" and "See Mike's work".
  Replaced in part by `docs/specs/phone-first-screen.md`: the phone layout has its own hero.
- H3. What Mike does: three panels, for live events, custom caricatures, and logos and
  illustrations. Each has a picture, one line, a price, and two buttons: its quote and its
  gallery.
  Replaced in part by `docs/specs/phone-first-screen.md`: the picture is the link to the gallery, and one button stays.
  Changed on 2026-11-24 by the artist's order: a panel shows no price. The home page shows the
  work and leads to the quote form, which has the prices.
- H4. The work: four drawings, one from each category, and one button to the full gallery.
- H5. Proof: the number of years with the pen circle, and three customer quotes in speech
  bubbles.
  Replaced in part by `docs/specs/phone-first-screen.md`: one speech bubble shows each testimonial.
- H6. Close: one line and one "Get a quote" button.
- H7. The footer holds the business name and links for email, Facebook, LinkedIn, and the
  children's books site.

### Gallery

- G1. The gallery is the wall. The reference is `docs/design-studies/gallery.html`.
- G2. Each picture shows whole, in its own proportions.
- G3. A bar of five choices stays at the top of the screen: All, Party, Custom,
  Illustrations, Logos. Each shows its count. Each choice has its own address.
- G4. The first screen of a gallery gets the draw effect, one time for each visit to the
  site. A gallery that was already seen shows finished.
- G5. A press on a panel opens the large view, and the address changes to the address of
  that drawing. An address of a drawing, opened directly, shows the wall with that drawing
  in the large view.
- G6. In the large view: the arrow keys, two buttons, and a finger drag go to the next and
  the previous drawing. Escape, a close button, and a press outside the picture close it. A
  counter shows the position.
- G7. A new picture loads in full before anything moves. Then the old picture slides out and
  the new one slides in from the side it comes from. The large view uses no grey filter.
- G8. On a touch screen, the picture follows the finger. A drag of 60 pixels or more changes
  the drawing. A shorter drag returns the picture to the middle. The page behind the large
  view does not scroll.
- G9. The large view shows the burst under each picture. Its small line changes with the
  category. A press opens the quote form with the matching type already chosen.
- G10. The grid view, the list view, and the carousel view of today are removed.

### Quote form

- Q1. The form has three steps: choose, answer, and check and send. A thank-you screen
  follows. The reference is `docs/design-studies/quote-form.html`.
- Q2. Step 1 shows three large picture cards, each with one line and its price.
- Q3. The address `/services?type=live`, `?type=custom`, or `?type=lni` opens the form at
  step 2 with that type chosen.
- Q4. Each field has its label above it, always visible, in plain words. No label is inside
  a field.
- Q5. A problem with an answer shows as a sentence under that field, and the form moves to
  the first such field. No problem is shown by an icon or a colour alone.
- Q6. Text is 18 pixels or larger. Each button and each field is 56 pixels tall or more.
- Q7. Background, words on the drawing, and logo or illustration are large buttons that show
  each choice with its cost. The number of people is a minus button, a plus button, and a
  number, from 1 to 50.
- Q8. The day uses the date picker of the device. The two times are lists with one entry for
  each 30 minutes.
- Q9. "Your estimate" stays at the bottom of the screen on steps 2 and 3, and changes as the
  visitor answers. Its amounts equal the amounts the server calculates.
- Q10. The form has an optional field for the customer's phone number. Its label says that
  it is optional and that Mike calls only if a detail is unclear.
- Q11. "Anything else Mike should know?" can stay empty.
- Q12. The send button says "Send my request". The words "You pay nothing now" are beside it.
- Q13. The location field keeps its behaviour from the first spec: suggestions after a pause
  of 300 ms and 3 characters, and a message when the travel cost cannot be calculated.
- Q14. The form sends its fields to `POST /api/quotes`, and shows the messages for a field
  error, a rate limit, and a server problem, as today.
- Q15. Each screen of the form arrives with one small pop. No field gets the draw effect.
- Q16. Mike's own phone number appears nowhere on the site.

### Words

- W1. The site speaks as the studio: "we" and "us". It says "Mike" where the person matters,
  for example who draws at an event and who reads a request. The words "he", "him", and "his"
  are not used for Mike. A customer quote keeps its own words.
- W2. The voice is a friendly tour of what the studio offers, as a host who shows a visitor
  around: "Here at Speedydoodle Studios, we ...". It is not a hard sell. The wording in the
  source is the reference. The wording in the studies is older.

### Path to a quote

- P1. Each page offers a quote in one press: the hero and the close of the home page, each of
  the three panels, the bar of the gallery, and the burst of the large view.
  Replaced in part by `docs/specs/phone-first-screen.md`: the phone hero has no button.
- P2. A quote button that belongs to one kind of work opens the form with that type chosen.

### Search

- E1. `/` is the home page.
- E2. Each page has its own title and description, with the words a customer searches for:
  the kind of work and the service area. The three in
  `docs/design-studies/share-previews.html` are the reference.
- E3. Each page has one main heading. The main heading of the home page names caricatures
  and the three service areas.
- E4. Each page names its own address as its canonical address.
- E5. The home page carries structured data for a local business: the name, the services,
  the service area, the price range, and the links to Facebook and LinkedIn. It gives the
  state and the country, and no street and no town.
- E6. `/sitemap.xml` lists each address from F2. `robots.txt` names the sitemap.
- E7. Each picture has a text description. Until captions exist, the description is made
  from the category and the file name.
- E8. The hero picture is served in a modern format at the size of the screen. No picture
  on the home page is larger than 200 KB.
- E9. Each picture has its width and its height in the HTML, so the page does not jump while
  it loads.

### Share previews

- X1. Each page has the Open Graph tags: title, description, picture, address, type, and
  site name, with the width, the height, and a description of the picture.
- X2. The home page, the gallery, and the quote form each have a share card of 1200 by 630
  pixels in the comic style. The reference is `docs/design-studies/share-previews.html`.
- X3. The share picture of a drawing's address is that drawing.
- X4. The theme colour of each page is the accent colour.
- X5. The same HTML goes to each visitor. No code detects a bot.

### Server (B)

- B1. `POST /api/quotes` accepts an optional `phone` field: digits, spaces, and the
  characters `+ - ( ) .`, 7 to 25 characters. The server stores it and shows it in the email
  to Mike.
- B2. `additionalInfo` is optional. An empty value is accepted.

## Decisions

Decisions the owner made in the design session:

- D1 (artistic feel). Three things carry it and are kept: the artwork, the dark stage, and
  one accent colour from the logo. The font, the shapes, the layout, and the spacing are
  free to change.
- D2 (type). Bangers as it is, with its lean. Rejected: an upright copy by transform, and
  four upright comic fonts. Rejected first: Inter for everything, because "seeing all Inter
  ain't helping" a caricature artist show personal taste.
- D3 (shape). Comic panels for the whole site. Rejected: clean and soft, and outlines only
  on the things a visitor presses.
- D4 (motion). Level 4. Rejected: levels 1 to 3.
- D5 (home page). Five sections in the order of H1.
- D6 (home page look). The home study passed as it is.
- D7 (gallery). The wall. Rejected: the comic book and the line, because "we start
  sacrificing usability for artistry on some of these". The draw effect is limited, because
  "it gets busy on the eyes when it's so many images being drawn".
- D8 (path to a quote). A cartoon "Get a quote" in the large view, and the type chosen in
  advance, for "good clickthrough, visits converted to purchases".
- D9 (phone numbers). Mike's number is not shown. The customer's number is optional.
- D10 (voice). First: "Mike", not "he", friendly and informal. Revised on 2026-11-17 after the
  owner read the built site: "Mike, Mike, Mike" was too much. The studio speaks as "we", with
  "Mike when needed, we when sensible", in the tone of a tour of what the studio offers.
- D11 (rendering). React Router with pre-rendering. Rejected: Astro and Next.js, which are
  larger rewrites, and the current browser rendering, which sends an empty page to a search
  engine. This replaces D20 (build system) of the first spec. [S1] [S2]
- D12 (share previews). Open Graph tags in pre-rendered HTML. Rejected: a bot detector,
  which is a workaround for pages built in the browser. [S3]
- D13 (drawing addresses). Each drawing has its own address and its own preview.
- D14 (home address). The start address that the server uses for travel distance is a home.
  It appears nowhere on the site.

Choices the author made, which the owner has not confirmed:

- U1. M2 (UI rewrite) of the first spec is merged and not released by itself. This spec is
  built on it, and the first release of the new build system is the redesigned site. This
  replaces requirements M2-6, M2-7, and M2-8 and the release order of the first spec.
- U2. A "Get a quote" button in the bar at the top of the gallery (part of P1).
- U3. The children's books link moves from a home page tile to the footer (H7). The `/about`
  page is removed (F4).
- U4. The details box is optional (Q11, B2).
- U5. The device's own date picker, and plain lists for the times (Q8), in place of the
  shadcn/ui calendar.
- U6. The wording and the prices of the three studies, and a main heading for the home page
  that names caricatures and the service area (E3).
- U7. The rule for long lists (M5), applied to the whole site. The two timing changes that
  the author proposed for the home page are not applied.
- U8. `/gallery` opens on "All", which mixes the four categories.
- U9. The four drawings on the home page are the first of each category, until Mike chooses.
- U10. The address of a drawing comes from its file name, until captions exist.
- U11. Structured data gives the state and the country only (E5).
- U12. Fonts are served from the site itself (F7).
- U13. The gallery list is read at build time, and read again in the browser, so a new
  drawing shows at once and enters the built page at the next build.
- U14. shadcn/ui components stay for buttons, text fields, text areas, and choices. The
  large view may be custom code, if it traps focus and closes on Escape.

## Sources

- S1. React Router: Pre-Rendering, official documentation, version 8.5.1.
  https://reactrouter.com/how-to/pre-rendering
- S2. Google: JavaScript SEO basics, official documentation, no date shown.
  https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- S3. The Open Graph protocol. https://ogp.me/
- S4. Google: Local business structured data, official documentation, no date shown.
  https://developers.google.com/search/docs/appearance/structured-data/local-business

## Open questions

None.

## Acceptance checks

Foundation and search:

- `npm run build` ends with no error and `tsc --noEmit` reports none. (F1, F5)
- The build output holds an HTML file for `/`, `/gallery`, each category, each drawing, and
  `/services`. (F2)
- `curl https://speedydoodle.com/` returns HTML that contains the hero sentence, the three
  prices, and a customer quote. (F3)
  Since 2026-11-24 the home page shows no price, and `npm run check` fails if it shows one.
- With JavaScript turned off, each of the three pages shows all its text. (F3)
- `curl -I https://speedydoodle.com/homepage` returns status 301 to `/`. (F4)
- `curl` of each page shows a different title and description, one `h1`, and a canonical
  address. (E2, E3, E4)
- Google's Rich Results Test reads the structured data of the home page with no error, and
  the data holds no street and no town. (E5)
- `/sitemap.xml` is XML and lists each address. (E6)
- No request for a font goes to a different site. (F7)
- No picture on the home page is larger than 200 KB. (E8)
- `grep` of the source finds no component that reads `window.innerWidth` while it renders.
  (F6)

Share previews:

- `curl` of each page shows the six Open Graph tags and the theme colour. (X1, X4)
- A link to the home page, the gallery, the quote form, and one drawing, each pasted into
  Discord and into Messages, shows its own card. The drawing's link shows that drawing.
  (X2, X3)

Look and motion, judged by the owner on a computer and on an iPhone in Safari:

- Each page matches its study in type, shape, and motion. (T1 to S5, M1, H1, G1, Q1)
- On the home page, each section draws one time and does not draw again on a second scroll.
  (M2)
- In the gallery, only the first screen is drawn, and a second visit to a category shows it
  finished. (M5, G4)
- With "reduce motion" on, nothing moves. (M6)
- `docs/motion.md` exists and lists each animation. (M7)

Gallery:

- A press on a panel opens the large view and changes the address. That address, opened in a
  new tab, shows the same drawing. (G5)
- A swipe on an iPhone moves the picture with the finger, with no grey or white blink, and
  the wall behind does not scroll. (G7, G8)
- Five fast presses of "next" end on the correct drawing with one picture on the screen.
  (G6, G7)
- The burst under a party drawing opens the quote form at step 2 with "live" chosen. (G9)

Quote form:

- One quote of each type, sent from the live form, arrives in both inboxes with the price
  that the form showed. (Q9, Q14)
- A quote with a phone number shows the number in the email to Mike. A quote without one is
  accepted. (Q10, B1)
- A quote with the details box empty is accepted. (Q11, B2)
- "Next" with an empty required field shows a sentence under that field and moves to it.
  (Q5)
- `/services?type=custom` opens at step 2. (Q3)
- The server tests pass, with new tests for B1 and B2.

Words:

- A search of the built pages finds no "he", "him", or "his" outside a customer quote. (W1)
- The site shows no phone number of Mike. (Q16)
