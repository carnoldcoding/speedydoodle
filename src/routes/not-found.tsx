import { ComicButton } from "@/components/ComicButton";

export function meta() {
  return [{ title: "Page not found | Speedydoodle Studios" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <main className="dots px-page py-24 text-center">
      <p className="kicker">Page not found</p>
      <h1 className="title mt-1">Mike didn't draw this page</h1>
      <p className="mx-auto mt-4 max-w-[44ch] text-[#dcdcdc]">The address may be old or mistyped.</p>
      <div className="mt-8">
        <ComicButton to="/">Back to the home page</ComicButton>
      </div>
    </main>
  );
}
