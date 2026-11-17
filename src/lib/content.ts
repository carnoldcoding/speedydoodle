import { API_URL } from "./api";
import type { Prices } from "./estimate";

// What the admin user can change: the prices, a few numbers, and the customer quotes.
export interface Testimonial {
  text: string;
  name: string;
}

export interface Content {
  prices: Prices;
  yearsOfExperience: number;
  testimonials: Testimonial[];
}

// The names of the content settings on the server.
type SettingKey =
  | "live_hourly_rate"
  | "live_faces_per_hour"
  | "custom_base_price"
  | "custom_person_1_price"
  | "custom_person_2_price"
  | "custom_person_3_price"
  | "custom_person_extra_price"
  | "custom_text_price"
  | "custom_background_simple"
  | "custom_background_complex"
  | "illustration_price"
  | "logo_hourly_rate"
  | "years_of_experience";

export interface ContentAnswer {
  settings: Record<SettingKey, number>;
  testimonials: Testimonial[];
}

// Turn the answer of the server into the content of the pages.
export function toContent(answer: ContentAnswer): Content {
  const s = answer.settings;
  return {
    prices: {
      liveHourlyRate: s.live_hourly_rate,
      facesPerHour: s.live_faces_per_hour,
      customBase: s.custom_base_price,
      customPeople: [0, s.custom_person_1_price, s.custom_person_2_price, s.custom_person_3_price],
      customExtraPerson: s.custom_person_extra_price,
      backgroundSimple: s.custom_background_simple,
      backgroundComplex: s.custom_background_complex,
      words: s.custom_text_price,
      logoHourlyRate: s.logo_hourly_rate,
      illustration: s.illustration_price,
    },
    yearsOfExperience: s.years_of_experience,
    testimonials: answer.testimonials.map(({ text, name }) => ({ text, name })),
  };
}

// Read the content from the server. This runs when the site is built, and again in the
// browser, so a change in the admin panel shows without a new build.
export async function fetchContent(): Promise<Content> {
  const response = await fetch(`${API_URL}/api/content`);
  if (!response.ok) throw new Error(`The content did not load (status ${response.status})`);
  return toContent(await response.json());
}
