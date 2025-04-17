import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CI-Log-Viewer" },
    { name: "description", content: "Homepage of CI-Log-Viewer" },
  ];
}

export default function Home() {
  return <Welcome />;
}
