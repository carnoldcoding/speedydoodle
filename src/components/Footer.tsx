import { SITE } from "@/lib/site";

const LINKS = [
  { href: `mailto:${SITE.email}`, label: "Email" },
  { href: SITE.facebook, label: "Facebook" },
  { href: SITE.linkedin, label: "LinkedIn" },
  { href: SITE.books, label: "Children's books" },
];

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t-[3px] border-white bg-nav px-page py-6 text-[#cfcfcf]">
      <p className="comic text-2xl text-flame">
        Speedydoodle <span className="text-white">Studios</span>
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-1">
        {LINKS.map(({ href, label }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noreferrer" className="hover:text-flame">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
