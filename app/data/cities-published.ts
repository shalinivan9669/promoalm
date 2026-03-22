import type { CityPageData } from "../../shared/types/content";
import { cityPath, servicePath, staticPagePaths } from "../utils/routes";

const leadFormHref = `${staticPagePaths.contacts}#lead-form`;

function cityServiceAreaNote(city: string) {
  return `Работаем по Казахстану, локальный приоритет — ${city}. Без фейкового local office.`;
}

export const publishedCitiesData: CityPageData[] = [
  {
    slug: "almaty",
    status: "published",
    city: "Алматы",
    h1: "Вывески для бизнеса в Алматы с расчётом на читаемость фасада",
    meta: {
      title: "Вывески в Алматы для фасада и сети | Neon Market",
      description:
        "Фасадные вывески, световые короба и rollout для нескольких точек в Алматы: считаем по улице, согласовываем удалённо и подключаем монтаж по объекту.",
      path: cityPath("almaty")
    },
    hero: {
      eyebrow: "Плотный городской поток",
      title: "В Алматы вывеска должна читаться в фасадном потоке, а не теряться среди соседних решений",
      description:
        "По Алматы считаем проект как коммерческий инструмент: читаемость с улицы, скорость запуска точки и аккуратный монтаж по объекту важнее декоративной картинки.",
      facts: ["Читаемость с улицы", "Быстрый запуск точки", "Rollout для нескольких адресов"],
      actions: [
        {
          label: "Отправить вводные по Алматы",
          href: leadFormHref,
          intent: "primary",
          trackingEvent: "open_city_page"
        }
      ],
      note: cityServiceAreaNote("Алматы")
    },
    intro:
      "Для Алматы вывеска должна работать в плотном городском потоке: быть заметной, не теряться на фасаде и быстро доходить до запуска.",
    sections: ["hero", "trust", "proof", "delivery", "faq", "related", "cta"],
    localAngle:
      "Алматы требует не абстрактного дизайна, а вывески, которую видно на реальной улице: размер, свет и контраст важнее, чем эффектный рендер.",
    logisticsNote:
      "Если объект в Алматы, достаточно фото фасада и адреса. Дальше быстро считаем макет, уточняем доступ и отдельно согласовываем монтаж.",
    serviceModel: "delivery-partner-install",
    hasLocalAddress: false,
    hasRealCases: false,
    serviceHighlights: [
      "Фасадные вывески для плотного потока",
      "Световые короба для быстрых запусков",
      "Вывески для сети и нескольких точек"
    ],
    trustItems: [
      {
        label: "Формат",
        value: "По Казахстану",
        description: "Локальный приоритет — Алматы, но адрес не показываем без подтверждения.",
        evidenceLevel: "confirmed"
      },
      {
        label: "Фокус",
        value: "Читаемость фасада",
        description: "Считаем по улице, дистанции и визуальному шуму вокруг точки.",
        evidenceLevel: "confirmed"
      },
      {
        label: "Монтаж",
        value: "По согласованию",
        description: "Проверяем доступ, крепление и график до запуска.",
        evidenceLevel: "confirmed"
      }
    ],
    faq: [
      {
        id: "almaty-calculation",
        question: "Чем расчёт по Алматы отличается от общего запроса?",
        answer:
          "В Алматы чаще важны плотный фасадный шум, сроки открытия и читаемость в конкурентной среде. Поэтому сначала смотрим на улицу и фасад, а уже потом на визуал."
      },
      {
        id: "almaty-multi-location",
        question: "Можно ли быстро посчитать несколько точек?",
        answer:
          "Да. Если отправить адреса, количество объектов и базовый тип носителя, можно собрать один rollout-пакет вместо отдельных расчётов по каждой точке."
      },
      {
        id: "almaty-install",
        question: "Делаете ли монтаж в Алматы?",
        answer:
          "Да, по согласованию и после проверки объекта. Смотрим на доступ, высоту и крепление, чтобы не обещать то, что нельзя безопасно поставить."
      },
      {
        id: "almaty-office",
        question: "Почему на странице нет локального адреса?",
        answer:
          "Потому что мы не называем город local office без подтверждённого адреса. Эта страница честно работает как service-area hub."
      }
    ],
    relatedServiceSlugs: ["fasadnye-vyveski", "svetovye-koroba", "vyveski-dlya-seti"],
    relatedCaseIds: ["coffee-lightbox-entry", "cyber-club-facade-rollout"],
    relatedLinks: [
      {
        label: "Кейсы",
        href: staticPagePaths.cases,
        description: "Сценарии и типовые проекты с похожей логикой."
      },
      {
        label: "Доставка по Казахстану",
        href: staticPagePaths.delivery,
        description: "Как идёт удалённая отправка и согласование."
      },
      {
        label: "Контакты",
        href: staticPagePaths.contacts,
        description: "Пришлите фото фасада и короткое ТЗ."
      }
    ],
    cta: {
      label: "Получить расчёт по Алматы",
      href: leadFormHref,
      intent: "primary",
      trackingEvent: "click_calculate"
    }
  },
  {
    slug: "astana",
    status: "published",
    city: "Астана",
    h1: "Вывески для бизнеса в Астане с расчётом на масштаб и видимость",
    meta: {
      title: "Вывески в Астане под заметные объекты | Neon Market",
      description:
        "Фасадные вывески, крышные установки и вывески под ключ в Астане: заранее считаем конструктив, высоту, доступ и монтажный маршрут.",
      path: cityPath("astana")
    },
    hero: {
      eyebrow: "Заметность с дистанции",
      title: "В Астане вывеска должна держать дистанцию, высоту и масштаб объекта",
      description:
        "Здесь проект считают не только по макету. Нужны конструктив, крепление, режим света и понятный монтажный маршрут, особенно если объект должен быть заметен издалека.",
      facts: ["Видимость с дистанции", "Высота и конструктив", "Крышные и фасадные решения"],
      actions: [
        {
          label: "Отправить вводные по Астане",
          href: leadFormHref,
          intent: "primary",
          trackingEvent: "open_city_page"
        }
      ],
      note: cityServiceAreaNote("Астана")
    },
    intro:
      "Для Астаны важны заметность, масштаб и то, как конструкция будет жить на объекте. Если считать это как обычную вывеску, бюджет и сроки быстро расходятся.",
    sections: ["hero", "trust", "proof", "delivery", "faq", "related", "cta"],
    localAngle:
      "В Астане часто нужны решения, которые заметны с расстояния и при этом честно проходят по несущей части, доступу и монтажу.",
    logisticsNote:
      "Перед расчётом по Астане лучше собрать высоту, тип поверхности, доступ и режим света. Так быстрее видно, как собрать конструктив и где проект упрётся в ограничения.",
    serviceModel: "delivery-partner-install",
    hasLocalAddress: false,
    hasRealCases: false,
    serviceHighlights: [
      "Крышные установки для заметных объектов",
      "Фасадные вывески с расчётом на высоту",
      "Вывески под ключ для сложных маршрутов"
    ],
    trustItems: [
      {
        label: "Формат",
        value: "По Казахстану",
        description: "Локальный приоритет — Астана, но local office без подтверждения не заявляем.",
        evidenceLevel: "confirmed"
      },
      {
        label: "Фокус",
        value: "Высота и конструктив",
        description: "Считаем масштаб, доступ и несущую часть до запуска в производство.",
        evidenceLevel: "confirmed"
      },
      {
        label: "Монтаж",
        value: "По согласованию",
        description: "Устанавливаем после проверки объекта и монтажного маршрута.",
        evidenceLevel: "confirmed"
      }
    ],
    faq: [
      {
        id: "astana-price",
        question: "Почему в Астане нельзя обещать цену без вводных по объекту?",
        answer:
          "Потому что на заметных объектах цена зависит от высоты, доступа, типа крепления и конструктивной части. Без этих данных расчёт будет неточным."
      },
      {
        id: "astana-roof",
        question: "Чем крышная установка отличается от обычной фасадной вывески?",
        answer:
          "Крышная установка сильнее зависит от несущей части, высоты и монтажного доступа. Это уже не простой знак на фасаде, а отдельный конструктивный проект."
      },
      {
        id: "astana-remote",
        question: "Можно ли всё начать удалённо?",
        answer:
          "Да. Для старта достаточно фото объекта, ориентировочных размеров и задачи. Дальше считаем конструктив и только потом фиксируем производство и монтаж."
      },
      {
        id: "astana-office",
        question: "Есть ли локальный офис в Астане?",
        answer:
          "Нет подтверждённого локального адреса, поэтому эта страница честно работает как service-area hub без fake office."
      }
    ],
    relatedServiceSlugs: ["kryshnye-ustanovki", "fasadnye-vyveski", "vyveski-pod-klyuch"],
    relatedCaseIds: ["roof-sign-retail", "letters-for-clinic"],
    relatedLinks: [
      {
        label: "Доставка по Казахстану",
        href: staticPagePaths.delivery,
        description: "Как собираем логистику и маршрут по объекту."
      },
      {
        label: "Оплата и гарантия",
        href: staticPagePaths.payment,
        description: "Как устроены предоплата и гарантийный контур."
      },
      {
        label: "Контакты",
        href: staticPagePaths.contacts,
        description: "Пришлите фото объекта и ориентир по высоте."
      }
    ],
    cta: {
      label: "Обсудить проект по Астане",
      href: leadFormHref,
      intent: "primary",
      trackingEvent: "click_calculate"
    }
  },
  {
    slug: "shymkent",
    status: "published",
    city: "Шымкент",
    h1: "Вывески для бизнеса в Шымкенте с быстрым удалённым стартом",
    meta: {
      title: "Вывески в Шымкенте с быстрым удалённым запуском | Neon Market",
      description:
        "Вывески в Шымкенте для фасада и интерьера: можно стартовать удалённо, быстро собрать макет и отдельно согласовать доставку и монтаж.",
      path: cityPath("shymkent")
    },
    hero: {
      eyebrow: "Быстрый удалённый старт",
      title: "В Шымкенте проект удобно запускать быстро и без лишних касаний",
      description:
        "Стартуем по фото, адресу и логотипу, быстро собираем макет и ведём производство. Если объекту нужен монтаж, он подключается по реальному сценарию, а не по шаблону.",
      facts: ["Удалённый старт", "Фасад и интерьер для B2B", "Понятная отгрузка и монтаж"],
      actions: [
        {
          label: "Прислать задачу по Шымкенту",
          href: leadFormHref,
          intent: "primary",
          trackingEvent: "open_city_page"
        }
      ],
      note: cityServiceAreaNote("Шымкент")
    },
    intro:
      "Для Шымкента удобен короткий маршрут: фото, расчёт, макет, производство и отправка. Это экономит время, когда объект можно вести дистанционно.",
    sections: ["hero", "trust", "proof", "delivery", "faq", "related", "cta"],
    localAngle:
      "Шымкент хорошо подходит для задач, где важны не сложные обещания, а понятный коммерческий маршрут от заявки до готовой вывески.",
    logisticsNote:
      "Если нужен быстрый старт, достаточно фото объекта, адреса и логотипа. Дальше считаем вариант, показываем макет и отдельно подключаем монтаж по согласованию.",
    serviceModel: "delivery-partner-install",
    hasLocalAddress: false,
    hasRealCases: false,
    serviceHighlights: [
      "Световые короба для быстрого запуска",
      "Интерьерные вывески для B2B",
      "Вывески под ключ с удалённым согласованием"
    ],
    trustItems: [
      {
        label: "Формат",
        value: "По Казахстану",
        description: "Стартуем удалённо и не называем local office без подтверждения адреса.",
        evidenceLevel: "confirmed"
      },
      {
        label: "Фокус",
        value: "Быстрый маршрут",
        description: "Сначала фото и адрес, потом макет и производство без лишних касаний.",
        evidenceLevel: "confirmed"
      },
      {
        label: "Монтаж",
        value: "По согласованию",
        description: "Подключаем его только когда по объекту понятен доступ и маршрут.",
        evidenceLevel: "confirmed"
      }
    ],
    faq: [
      {
        id: "shymkent-online",
        question: "Можно ли всё согласовать онлайн?",
        answer:
          "Да. Для старта достаточно фото объекта, адреса и логотипа. Дальше делаем расчёт, показываем макет и идём в производство."
      },
      {
        id: "shymkent-format",
        question: "Что чаще заказывают: фасад или интерьер?",
        answer:
          "Зависит от задачи. Для улицы считаем фасадные решения, а для шоурумов, сервисных зон и офисов продаж — интерьерные B2B-носители."
      },
      {
        id: "shymkent-install",
        question: "Нужно ли монтаж согласовывать отдельно?",
        answer:
          "Да. Как и в других городах, монтаж зависит от объекта, доступа, крепления и графика. Этот этап не смешиваем с производством."
      },
      {
        id: "shymkent-price",
        question: "Есть ли отдельный прайс по Шымкенту?",
        answer:
          "Отдельного прайса по названию города нет. Цена зависит от типа конструкции, логистики и монтажного сценария."
      }
    ],
    relatedServiceSlugs: ["svetovye-koroba", "interernye-vyveski-dlya-biznesa", "vyveski-pod-klyuch"],
    relatedCaseIds: ["interior-logo-showroom", "regional-delivery-pack"],
    relatedLinks: [
      {
        label: "FAQ",
        href: staticPagePaths.faq,
        description: "Коротко о старте, сроках и формате согласования."
      },
      {
        label: "Доставка по Казахстану",
        href: staticPagePaths.delivery,
        description: "Как проходит отправка и, при необходимости, монтаж."
      },
      {
        label: "Контакты",
        href: staticPagePaths.contacts,
        description: "Лучше всего прислать фото объекта и логотип."
      }
    ],
    cta: {
      label: "Запросить расчёт по Шымкенту",
      href: leadFormHref,
      intent: "primary",
      trackingEvent: "click_calculate"
    }
  }
];
