import "server-only";
import { getDictWith, type Dict } from "./i18n";
import type { Lang } from "./i18n/config";
import { getTranslations } from "./store";

export function getDict(lang: Lang): Dict {
  return getDictWith(lang, getTranslations());
}
