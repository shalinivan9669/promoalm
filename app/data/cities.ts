import { plannedCitiesData } from "./cities-planned";
import { publishedCitiesData } from "./cities-published";

export const cities = [...publishedCitiesData, ...plannedCitiesData];
