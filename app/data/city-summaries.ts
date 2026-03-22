import type { NavItem } from "../../shared/types/content";
import { publishedCitiesData } from "./cities-published";

export const publishedCityNavigation: NavItem[] = publishedCitiesData.map((city) => ({
  label: city.city,
  href: city.meta.path,
  description: city.localAngle
}));
