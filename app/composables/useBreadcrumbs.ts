import type { BreadcrumbItem } from "../../shared/types/content";
import { staticPagePaths } from "../utils/routes";

export function useBreadcrumbs(items: BreadcrumbItem[]) {
  return [
    {
      label: "Главная",
      href: staticPagePaths.home
    },
    ...items
  ];
}
