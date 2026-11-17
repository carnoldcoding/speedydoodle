import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // /gallery, /gallery/<category>, and /gallery/<category>/<drawing> are one page.
  route("gallery/:category?/:slug?", "routes/gallery.tsx"),
  route("services", "routes/services.tsx"),
  // The admin panel. The build writes no HTML file for it, so the browser builds it.
  route("admin", "routes/admin.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
