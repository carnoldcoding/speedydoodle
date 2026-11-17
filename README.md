## Speedydoodle Studios

The website of Mike Arnold, a caricature artist: https://speedydoodle.com

The site is React with React Router in framework mode, TypeScript, and Tailwind CSS. The build
writes each page to an HTML file, and Netlify serves the files. The backend is a separate
repository.

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the site for development |
| `npm run build` | Write each page to `build/client`, then write the sitemap |
| `npm run check` | Check the built site against the requirements a program can check |
| `npm run preview` | Serve the built site at http://127.0.0.1:4173 |
| `npm test` | Run the unit tests |
| `npm run typecheck` | Run the TypeScript checks |
| `npm run images` | Make the small copies of the artwork again |

The build reads the gallery lists from the live backend, so it needs a network connection.

### Where things are

| Path | Content |
|---|---|
| `src/routes/` | One file for each page |
| `src/app.css` | The theme and the comic design system |
| `src/lib/` | Logic with unit tests: the price estimate, the gallery lists, the quote request |
| `docs/specs/` | The specification of the redesign |
| `docs/design-studies/` | The throwaway pages that show each design decision |
| `docs/motion.md` | Each animation with its timing |
| `CONTEXT.md` | The terms this project uses |
