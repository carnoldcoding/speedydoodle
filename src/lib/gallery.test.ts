import { describe, expect, it } from "vitest";
import { describePicture, sized, slugFromUrl, toPictures } from "./gallery";

describe("the address name of a drawing", () => {
  it("comes from the file name, in lower case, with hyphens", () => {
    expect(slugFromUrl("https://ik.imagekit.io/x/party_caricatures/05-Party_Caricatures.jpg?updatedAt=1")).toBe("05-party-caricatures");
    expect(slugFromUrl("https://ik.imagekit.io/x/custom_caricatures/SD-Joe-GIFT-Caricature.jpg")).toBe("sd-joe-gift-caricature");
  });
  it("keeps only letters, digits, and hyphens", () => {
    expect(slugFromUrl("https://ik.imagekit.io/x/logos/Big%20Cat's  Logo (final).v2.png")).toBe("big-cat-s-logo-final-v2");
  });
});

describe("a list of drawings", () => {
  const item = (name: string) => ({ url: `https://ik.imagekit.io/x/logos/${name}`, width: 400, height: 300 });

  it("gives two drawings with the same file name two different addresses", () => {
    const pictures = toPictures("logos", [item("a.jpg"), item("A.png"), item("a.webp")]);
    expect(pictures.map((p) => p.slug)).toEqual(["a", "a-2", "a-3"]);
  });
  it("keeps the size of each drawing, and uses 4 by 5 when the size is missing", () => {
    const [first, second] = toPictures("logos", [item("a.jpg"), { url: "https://ik.imagekit.io/x/logos/b.jpg" }]);
    expect([first.width, first.height, second.width, second.height]).toEqual([400, 300, 4, 5]);
  });
});

describe("a picture address at a width", () => {
  it("replaces the query with the width", () => {
    expect(sized("https://ik.imagekit.io/x/logos/a.jpg?updatedAt=1", 520)).toBe("https://ik.imagekit.io/x/logos/a.jpg?tr=w-520");
  });
});

describe("the text description of a drawing", () => {
  it("names the kind of work and the words of the file name", () => {
    const [picture] = toPictures("party", [{ url: "https://ik.imagekit.io/x/party_caricatures/darlene-and-irv.jpg" }]);
    expect(describePicture(picture)).toBe("Party caricature by Mike Arnold: darlene and irv");
  });
  it("uses the caption from the admin panel when the drawing has one", () => {
    const [picture] = toPictures("party", [{ url: "https://ik.imagekit.io/x/party_caricatures/05-Party_Caricatures.jpg", caption: " Darlene and Irv at their anniversary " }]);
    expect(describePicture(picture)).toBe("Party caricature by Mike Arnold: Darlene and Irv at their anniversary");
    expect(picture.slug).toBe("05-party-caricatures");
  });
});
