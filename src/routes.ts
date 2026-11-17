import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // /gallery, /gallery/<category>, and /gallery/<category>/<drawing> are one page.
  route("gallery/:category?/:slug?", "routes/gallery.tsx"),
  route("services", "routes/services.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
