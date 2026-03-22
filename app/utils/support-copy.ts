import type { SupportIntent } from "../../shared/types/content";

export interface SupportPageCopy {
  quickFactsTitle: string;
  quickFactsDescription: string;
  tocTitle: string;
  tocDescription: string;
  faqTitle: string;
  faqDescription: string;
  relatedLinksTitle: string;
  relatedLinksDescription: string;
  ctaTitle: string;
  ctaDescription: string;
}

const SUPPORT_COPY: Record<SupportIntent, SupportPageCopy> = {
  "faq-hub": {
    quickFactsTitle: "Что важно понять до расчёта",
    quickFactsDescription: "Короткие факты, которые помогают не гадать по цене, срокам и монтажу.",
    tocTitle: "Навигация по вопросам",
    tocDescription: "Прыгайте к нужному блоку, если уже знаете, что именно нужно уточнить.",
    faqTitle: "Вопросы по заказу",
    faqDescription: "Собрали возражения, которые чаще всего мешают дойти до заявки.",
    relatedLinksTitle: "Куда двигаться дальше",
    relatedLinksDescription: "Похожие разделы, которые помогут выбрать формат вывески, монтаж и сценарий запуска.",
    ctaTitle: "Если нужна точная оценка по объекту",
    ctaDescription: "Пришлите фото, размеры и задачу. Для нескольких точек сразу укажите города и адреса."
  },
  delivery: {
    quickFactsTitle: "Как устроен удалённый запуск",
    quickFactsDescription: "Алматы остаётся базой, а проекты по Казахстану можно вести дистанционно.",
    tocTitle: "Навигация по доставке",
    tocDescription: "Быстрый переход к географии, логистике и сетевым сценариям.",
    faqTitle: "Частые вопросы по доставке",
    faqDescription: "Что можно согласовать онлайн, а что нужно уточнять по объекту и городу.",
    relatedLinksTitle: "Связанные маршруты",
    relatedLinksDescription: "Похожие разделы, которые помогают собрать маршрут проекта до конца.",
    ctaTitle: "Нужен расчёт с доставкой",
    ctaDescription: "Отправьте фото, адреса и количество точек. Если объектов несколько, мы сразу считаем rollout."
  },
  payment: {
    quickFactsTitle: "Что влияет на запуск и оплату",
    quickFactsDescription: "Предоплата, гарантия и документы здесь завязаны на производственную логику, а не на формальность.",
    tocTitle: "Навигация по условиям",
    tocDescription: "Можно сразу открыть оплату, гарантию, документы или сетевой сценарий.",
    faqTitle: "Частые вопросы по оплате",
    faqDescription: "Ниже ответы на вопросы, которые чаще всего требуют отдельного пояснения до старта.",
    relatedLinksTitle: "Связанные условия",
    relatedLinksDescription: "Похожие разделы, которые помогают сверить доставку, контакты и формат запуска.",
    ctaTitle: "Обсудить оплату и гарантию",
    ctaDescription: "Пришлите вводные по объекту или партии, и мы покажем подходящую схему запуска."
  },
  privacy: {
    quickFactsTitle: "Как мы работаем с данными",
    quickFactsDescription: "Без лишних полей и без сбора всего подряд.",
    tocTitle: "Навигация по политике",
    tocDescription: "Сразу откройте нужный раздел: данные, хранение, передача или удаление.",
    faqTitle: "Вопросы по обработке данных",
    faqDescription: "Короткие ответы на то, что обычно спрашивают перед отправкой формы.",
    relatedLinksTitle: "Смежные страницы",
    relatedLinksDescription: "Если нужен следующий шаг, посмотрите контакты и связанные условия.",
    ctaTitle: "Нужен вопрос по данным заявки",
    ctaDescription: "Напишите через контакты, если хотите уточнить состав данных, их удаление или правки."
  }
};

export function getSupportPageCopy(intent: SupportIntent) {
  return SUPPORT_COPY[intent];
}
