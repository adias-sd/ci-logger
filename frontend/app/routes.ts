import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("files", "routes/folders.tsx"),
    route("file/:fileId", "routes/file.tsx"),
] satisfies RouteConfig;
