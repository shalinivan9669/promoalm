import { cities } from "../app/data/cities";
import { cases } from "../app/data/cases";
import { services } from "../app/data/services";
import { supportPages } from "../app/data/support-pages";
import { validateContentOrThrow } from "../shared/validation/content";

try {
  validateContentOrThrow({
    services,
    cities,
    cases,
    supportPages
  });

  console.log("Content validation passed.");
} catch (error) {
  console.error("Content validation failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
