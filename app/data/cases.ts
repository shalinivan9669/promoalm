import type { CaseStudy } from "../../shared/types/content";

export const cases: CaseStudy[] = [
  {
    id: "cyber-club-facade-rollout",
    status: "published",
    proofMode: "scenario",
    evidenceLevel: "placeholder",
    slug: "cyber-club-facade-rollout",
    title: "Фасадный комплект для сети компьютерных клубов",
    summary:
      "Сценарий для сети, которой нужна единая фасадная подача на нескольких точках без ручного переизобретения каждой вывески.",
    challenge:
      "Клиенту нужен единый вид по городам, понятный монтажный сценарий и партия, которую можно отправлять этапами без потери качества.",
    solution:
      "Собираем базовый комплект: объёмные буквы, световой короб для входной видимости, монтажную схему и пакет согласованных макетов по точкам.",
    deliverables: ["Макетная система для нескольких точек", "Производство партии", "Логистика по городам", "Монтаж по согласованию"],
    metrics: ["Фокус на повторяемом качестве", "Подходит для rollout 3+ точек"],
    industry: "Компьютерные клубы",
    cityLabel: "Казахстан",
    relatedServiceSlugs: ["fasadnye-vyveski", "vyveski-dlya-seti", "montazh-vyvesok"],
    relatedCitySlugs: ["almaty", "astana", "shymkent"]
  },
  {
    id: "coffee-lightbox-entry",
    status: "published",
    proofMode: "scenario",
    evidenceLevel: "placeholder",
    slug: "coffee-lightbox-entry",
    title: "Световой короб для точки общепита",
    summary:
      "Сценарий для кафе или кофейни, где нужна читаемая вывеска с улицы и быстрый запуск без сложной крышной конструкции.",
    challenge:
      "Точка открывается в сжатые сроки, фасад компактный, а бренд должен быть виден и днём, и вечером.",
    solution:
      "Считаем световой короб под фасад, подбираем размер и крепление, собираем макет, затем отгружаем и монтируем по согласованному графику.",
    deliverables: ["Световой короб", "Макет", "Крепление под объект", "Монтаж по месту"],
    metrics: ["Стандартный цикл 3–7 дней", "Минимальный заказ от 100 000 ₸"],
    industry: "Общепит",
    cityLabel: "Алматы",
    relatedServiceSlugs: ["svetovye-koroba", "vyveski-pod-klyuch", "montazh-vyvesok"],
    relatedCitySlugs: ["almaty"]
  },
  {
    id: "roof-sign-retail",
    status: "published",
    proofMode: "scenario",
    evidenceLevel: "placeholder",
    slug: "roof-sign-retail",
    title: "Крышная установка для заметного retail-объекта",
    summary:
      "Сценарий для объекта, которому нужна видимость с расстояния и отдельный расчёт по несущей части, доступу и монтажу.",
    challenge:
      "У крышной конструкции нет честной фиксированной цены: всё упирается в размер, доступ, металлокаркас, электрику и условия объекта.",
    solution:
      "Сначала собираем вводные по месту, затем считаем конструктив, делаем макет, согласуем график и выводим установку в производство только после уточнения всех ограничений.",
    deliverables: ["Предварительный расчёт", "Макет", "Конструктив", "Монтажная логика"],
    metrics: ["Нельзя считать по шаблону", "Требует отдельного согласования доступа"],
    industry: "Retail",
    cityLabel: "Астана",
    relatedServiceSlugs: ["kryshnye-ustanovki", "vyveski-pod-klyuch"],
    relatedCitySlugs: ["astana"]
  },
  {
    id: "interior-logo-showroom",
    status: "published",
    proofMode: "scenario",
    evidenceLevel: "placeholder",
    slug: "interior-logo-showroom",
    title: "Интерьерный логотип для коммерческого пространства",
    summary:
      "Сценарий для шоурума, офиса продаж или студии, где нужен чистый световой акцент внутри помещения без попытки вынести интерьерный неон на улицу.",
    challenge:
      "Нужно сохранить фирменный стиль и получить заметный интерьерный знак, который не спорит с остальным пространством.",
    solution:
      "Собираем интерьерную вывеску под задачи помещения: логотип, световой контур или неоновый акцент для зоны клиента.",
    deliverables: ["Интерьерный логотип", "Неоновый акцент для помещения", "Онлайн-согласование макета"],
    metrics: ["Только для помещения", "Отдельная логика от фасадных решений"],
    industry: "Шоурумы и офисы продаж",
    cityLabel: "Шымкент",
    relatedServiceSlugs: ["interernye-vyveski-dlya-biznesa", "vyveski-pod-klyuch"],
    relatedCitySlugs: ["shymkent"]
  },
  {
    id: "neon-signage-showroom",
    status: "published",
    proofMode: "scenario",
    evidenceLevel: "placeholder",
    slug: "neon-signage-showroom",
    title: "Неоновая вывеска для шоурума и клиентской зоны",
    summary:
      "Сценарий для интерьера, где нужен заметный световой акцент, читаемый бренд-знак и аккуратный монтаж без уличной нагрузки.",
    challenge:
      "Клиенту нужен выразительный неоновый акцент внутри помещения, который хорошо смотрится в фото и не спорит с интерьером.",
    solution:
      "Проектируем неоновую вывеску под стену и сценарий света, подбираем цвет, толщину контура, крепление и комплект под безопасный монтаж.",
    deliverables: ["Неоновая вывеска", "Макет под интерьер", "Схема крепления и подключения", "Монтажный комплект"],
    metrics: ["Только для помещений", "Читается в кадре и вживую", "Не заменяет фасадную вывеску"],
    industry: "Шоурумы и клиентские зоны",
    cityLabel: "Алматы",
    relatedServiceSlugs: ["neonovye-vyveski", "interernye-vyveski-dlya-biznesa"],
    relatedCitySlugs: ["almaty"]
  },
  {
    id: "letters-for-clinic",
    status: "published",
    proofMode: "scenario",
    evidenceLevel: "placeholder",
    slug: "letters-for-clinic",
    title: "Объёмные буквы для клиники или сервисной компании",
    summary:
      "Сценарий для объекта, которому нужна строгая подача бренда без перегруза и с понятной читаемостью с улицы.",
    challenge:
      "Важно получить аккуратную форму букв, ровную подсветку и монтаж, который не портит фасад.",
    solution:
      "Проектируем буквы под конкретный размер, подбираем материалы и тип свечения, согласуем макет и выпускаем комплект под монтаж.",
    deliverables: ["Объёмные буквы", "Подсветка под режим работы объекта", "Монтажный комплект"],
    metrics: ["Подходит для фасада", "Часто берут с выездом на замер"],
    industry: "Медицина и сервис",
    cityLabel: "Казахстан",
    relatedServiceSlugs: ["obemnye-bukvy", "fasadnye-vyveski", "montazh-vyvesok"],
    relatedCitySlugs: ["almaty", "astana"]
  },
  {
    id: "regional-delivery-pack",
    status: "published",
    proofMode: "scenario",
    evidenceLevel: "placeholder",
    slug: "regional-delivery-pack",
    title: "Удалённый заказ с доставкой по Казахстану",
    summary:
      "Сценарий для бизнеса вне базового города, когда согласование проходит дистанционно, а логистика и монтаж считаются отдельно.",
    challenge:
      "Нужно быстро сверить вводные, не тратить время на лишние созвоны и получить рабочий сценарий от макета до отгрузки.",
    solution:
      "Клиент присылает фото, размеры и логотип. Мы считаем задачу, выпускаем макет, запускаем производство и готовим отправку по согласованной схеме.",
    deliverables: ["Онлайн-согласование", "Упаковка под отправку", "Монтажный сценарий по городу"],
    metrics: ["Подходит для удалённых заказов", "Монтаж по согласованию"],
    industry: "Региональные бизнес-клиенты",
    cityLabel: "Казахстан",
    relatedServiceSlugs: ["vyveski-pod-klyuch", "vyveski-dlya-seti", "montazh-vyvesok"],
    relatedCitySlugs: ["almaty", "astana", "shymkent"]
  }
];
