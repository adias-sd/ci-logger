import type { Route } from "./+types/home";
import { FilesComponent } from "../components/folders";

import type { FolderProps } from '~/interfaces/folder';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "File Server Navigator" },
    { name: "description", content: "Allows file navigation" },
  ];
}

export default function File(params: FolderProps) {
  return <FilesComponent {...params}/>;
}

