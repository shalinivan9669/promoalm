import type {
  AboutPageData,
  ContactInfo,
  HomePageData,
  SeoMetaInput,
  SiteConfig,
  TrustStat
} from "../../shared/types/content";

export const siteConfig: SiteConfig = {
  brandName: "Neon Market",
  publicName: "Neon Market",
  defaultTitleSuffix: "Neon Market",
  baseDescription:
    "Базируемся в Алматы и ведём проекты по всему Казахстану: фасадные вывески, световые короба, объёмные буквы, крышные установки и монтаж для бизнеса.",
  primaryCity: "Алматы",
  coverage: "Весь Казахстан",
  minOrder: "от 100 000 ₸",
  leadTime: "3–7 дней",
  warranty: "1 год",
  prepayment: "50% после согласования макета",
  urgentOrders: "Срочные заказы возможны за доплату",
  designOffer: "Бесплатный дизайн-макет перед запуском"
};

export const contactInfo: ContactInfo = {
  brandName: "Neon Market",
  publicName: "Neon Market",
  shortDescription:
    "Базируемся в Алматы и ведём проекты по всему Казахстану: фасадные вывески, световые короба, объёмные буквы, крышные установки и монтаж для бизнеса.",
  primaryCity: "Алматы",
  coverage: "Весь Казахстан",
  serviceArea: "Алматы и Казахстан",
  minOrder: "Минимальный заказ от 100 000 ₸",
  leadTime: "Стандартный срок 3–7 дней",
  warranty: "Гарантия 1 год",
  prepayment: "Предоплата 50% после макета",
  designOffer: "Бесплатный дизайн-макет",
  channels: [
    {
      type: "whatsapp",
      label: "WhatsApp",
      value: "+7 778 415 55 11",
      href: "https://wa.me/77784155511",
      note: "Быстрый старт: фото объекта, адрес точки или короткое ТЗ.",
      available: true,
      evidenceLevel: "confirmed"
    },
    {
      type: "phone",
      label: "Телефон",
      value: "+7 778 415 55 11",
      href: "tel:+77784155511",
      note: "Звонки и WhatsApp: 10:00–19:00.",
      available: true,
      evidenceLevel: "confirmed"
    },
    {
      type: "email",
      label: "Email",
      value: "neon_vibe_market@mail.ru",
      href: "mailto:neon_vibe_market@mail.ru",
      note: "Для заявок и документов.",
      available: true,
      evidenceLevel: "confirmed"
    },
    {
      type: "form",
      label: "Форма расчёта",
      value: "Фото / адрес / ТЗ",
      href: "/kontakty/#lead-form",
      note: "Самый короткий путь, если нужно быстро оценить проект и формат конструкции.",
      available: true,
      evidenceLevel: "confirmed"
    }
  ],
  address: "г. Алматы, ул. Жумбактас, 3",
  addressEvidenceLevel: "confirmed",
  workingHours: "10:00–19:00",
  legalNote: "Реквизиты и рабочие контакты доступны через WhatsApp, телефон, email и форму."
};

export const globalTrustStats: TrustStat[] = [
  {
    label: "Минимальный заказ",
    value: "100 000 ₸",
    note: "Ниже этого порога проект в производство не ставим.",
    evidenceLevel: "confirmed",
    sourceType: "business-brief"
  },
  {
    label: "Срок запуска",
    value: "3–7 дней",
    note: "После макета и предоплаты по стандартным задачам.",
    evidenceLevel: "confirmed",
    sourceType: "business-brief"
  },
  {
    label: "Гарантия",
    value: "1 год",
    note: "На согласованный объём работ и комплектующие.",
    evidenceLevel: "confirmed",
    sourceType: "business-brief"
  },
  {
    label: "Формат работы",
    value: "Онлайн + монтаж",
    note: "Можно согласовать проект дистанционно и отдельно утвердить установку.",
    evidenceLevel: "confirmed",
    sourceType: "business-brief"
  }
];

export const staticPageMeta: Record<"home" | "about" | "contacts" | "cases", SeoMetaInput> = {
  home: {
    title: "Световые и фасадные вывески для бизнеса по Казахстану | Neon Market",
    description:
      "Производство световых и фасадных вывесок для бизнеса по Казахстану: расчёт, макет, изготовление, доставка, монтаж и rollout для сети.",
    path: "/"
  },
  about: {
    title: "Как Neon Market ведёт проекты по вывескам для бизнеса | Neon Market",
    description:
      "Как устроен проект в Neon Market: бриф, макет, производство, логистика и монтаж вывесок для одной точки или сети по Казахстану.",
    path: "/o-kompanii/"
  },
  contacts: {
    title: "Контакты для расчёта вывесок в Алматы и по Казахстану | Neon Market",
    description:
      "Связаться с Neon Market по вывескам для бизнеса: фасадные вывески, световые короба, объёмные буквы, монтаж и проекты для нескольких точек.",
    path: "/kontakty/"
  },
  cases: {
    title: "Кейсы и сценарии вывесок для бизнеса | Neon Market",
    description:
      "Сценарии по фасадным вывескам, световым коробам, объёмным буквам, rollout для сети и удалённым запускам по Казахстану.",
    path: "/cases/"
  }
};

export const homeHeroHeadline = {
  baseText: "Световые и фасадные",
  phrases: ["вывески для бизнеса", "вывески для сети", "вывески под ключ"],
  accessibleText: "Световые и фасадные вывески для бизнеса по Казахстану"
} as const;

export const homePageData: HomePageData = {
  hero: {
    eyebrow: "Расчёт, производство и монтаж по Казахстану",
    title: "Световые и фасадные вывески для бизнеса по Казахстану",
    description:
      "Делаем вывески для бизнеса под фасад, объект и город: фасадные вывески, световые короба, объёмные буквы, крышные установки, rollout для сети и монтаж по согласованному сценарию.",
    facts: ["Фасады, лайтбоксы, объёмные буквы", "Монтаж и rollout для сети", "Минимальный заказ от 100 000 ₸"],
    actions: [
      {
        label: "Рассчитать проект",
        href: "/kontakty/#lead-form",
        intent: "calculate",
        trackingEvent: "click_calculate"
      },
      {
        label: "Смотреть кейсы",
        href: "/cases/",
        intent: "secondary",
        trackingEvent: "open_case"
      }
    ],
    note:
      "Для первого расчёта достаточно фото объекта, размеров и логотипа. Если точек несколько, добавьте адреса и города."
  },
  intro:
    "Делаем световые и фасадные вывески для бизнеса: считаем носитель под улицу, объект, монтаж и запуск одной точки или всей сети по Казахстану.",
  industries: ["Street retail", "Кафе и рестораны", "Сервисные компании", "Франшизы и сети", "Подрядчики и девелоперы"],
  pricingSummary: [
    {
      title: "Что влияет на расчёт",
      text: "Смета собирается по задаче: размер, тип конструкции, подсветка, материалы, крепление, логистика, монтаж и количество адресов.",
      emphasis: "Так вы заранее видите, за что платите по одной точке или по сети."
    },
    {
      title: "Когда можно считать быстро",
      text: "Если есть фото точки, примерные размеры, логотип, список городов и понимание, нужна ли установка.",
      emphasis: "Чем точнее вводные, тем быстрее собираем расчёт и маршрут запуска."
    }
  ],
  deliveryHighlights: [
    "Удалённый запуск по Казахстану строится на нормальных вводных: фото, размеры, адрес, формат точки и понятная задача по каждой локации.",
    "По нескольким городам заранее фиксируем логистику, очередность адресов и объём работ, чтобы запуск не развалился после согласования макета.",
    "Монтаж согласовываем как отдельный этап: проверяем доступ на объект, ограничения по фасаду и удобный график для одной точки или rollout по сети."
  ],
  finalCta: {
    label: "Отправить вводные на расчёт",
    href: "/kontakty/#lead-form",
    intent: "primary",
    trackingEvent: "click_calculate",
    note: "Приложите фото, размеры и краткое описание задачи. Если точек несколько, добавьте количество адресов и города."
  }
};

export const aboutPageData: AboutPageData = {
  hero: {
    eyebrow: "О подрядчике",
    title: "Как Neon Market ведёт проект по вывескам для бизнеса",
    description:
      "Работаем там, где нужен управляемый результат: фасадные и световые вывески, повторяемое качество для нескольких точек и понятный маршрут от брифа до монтажа.",
    facts: ["Бесплатный дизайн-макет", "Монтаж и замер по согласованию", "Подходит для сетей и региональных заказов"],
    actions: [
      {
        label: "Обсудить задачу",
        href: "/kontakty/#lead-form",
        intent: "primary",
        trackingEvent: "submit_lead_form"
      },
      {
        label: "Открыть услуги",
        href: "/#services",
        intent: "secondary"
      }
    ]
  },
  summary:
    "Сначала фиксируем задачу, потом показываем макет, считаем конструкцию и только после этого запускаем изготовление. Так проект не распадается между дизайном, производством и монтажом.",
  strengths: [
    "Фасадные и световые вывески для бизнеса",
    "Тиражные и многоточечные заказы",
    "Удалённое согласование по Казахстану",
    "Монтаж по графику и по согласованному объекту"
  ],
  workPrinciples: [
    {
      title: "Брифуем задачу без лишнего шума",
      description: "Сначала понимаем, где будет конструкция, как она должна работать и есть ли ограничения по объекту."
    },
    {
      title: "Показываем макет до запуска",
      description: "Бесплатный дизайн-макет снимает базовые вопросы по виду, масштабу и читаемости."
    },
    {
      title: "Не обещаем уличный неон там, где он не нужен",
      description: "Интерьерные решения и фасадные конструкции — это разные сценарии с разной эксплуатацией."
    },
    {
      title: "Считаем логистику отдельно от красивых слов",
      description: "Если проект едет в другой город или на несколько точек, это сразу попадает в расчёт и график."
    }
  ],
  finalCta: {
    label: "Запросить проект",
    href: "/kontakty/#lead-form",
    intent: "primary",
    trackingEvent: "click_calculate"
  }
};
