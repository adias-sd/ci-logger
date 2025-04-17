import type { Route } from "./+types/home";
import { FileComponent } from "../components/file";

import type { FileProps } from '~/interfaces/file';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "File Visualizer" },
    { name: "description", content: "Visualizes individual files" },
  ];
}

export default function Files(params: FileProps) {
  return <FileComponent {...params}/>;
}
