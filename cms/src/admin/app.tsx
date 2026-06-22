import type { StrapiApp } from '@strapi/strapi/admin';

/**
 * Словарь русских названий атрибутов для Content Manager.
 * Ключи — имена атрибутов из schema.json.
 * Форматированные версии (с заглавной буквы, с пробелами) генерируются автоматически.
 */
const ATTRIBUTE_LABELS: Record<string, string> = {

  // — Товары и услуги (catalog-item) —
  item_title: 'Название',
  item_slug: 'URL-идентификатор',
  item_type: 'Тип элемента',
  item_category: 'Категория',
  item_price: 'Цена',
  item_manufacturer: 'Производитель',
  item_description: 'Описание',
  item_images: 'Изображения',
  characteristics: 'Характеристики',

  // — Категории (category) —
  category_title: 'Название категории',
  category_slug: 'URL категории',
  parent_category: 'Родительская категория',
  children_categories: 'Дочерние категории',
  catalog_items: 'Товары',
  category_description: 'Описание категории',

  // — Характеристики (characteristic) —
  characteristic_name: 'Название характеристики',
  characteristic_slug: 'URL характеристики',
  characteristic_unit: 'Единица измерения',

  // — Входящие заявки (incoming-request) —
  request_date: 'Дата заявки',
  contact_method: 'Способ связи',
  request_type: 'Тип заявки',
  items: 'Товары в заявке',
  items_summary: 'Сводка по товарам',
  page_url: 'URL страницы',
  message: 'Сообщение',

  // — FAQ —
  faq_title: 'Заголовок FAQ',
  faq_items: 'Вопросы и ответы',
  question: 'Вопрос',
  answer: 'Ответ',

  // — Общие поля (single types: about, contact, payment, privacy) —
  title: 'Заголовок',
  content: 'Содержание',
  name: 'Имя',
  phone: 'Телефон',
  email: 'Эл. почта',
  address: 'Адрес',
  latitude: 'Широта',
  longitude: 'Долгота',
  working_hours: 'Часы работы',

  // — Компоненты —
  characteristic: 'Характеристика',
  value: 'Значение',

  // — Системные поля таблиц коллекций —
  id: '№',
  status: 'Статус',
  createdAt: 'Создано',
  updatedAt: 'Обновлено',
};

// ─── Генерация полного словаря с форматированными вариантами ───

const labelMap: Record<string, string> = {};

for (const [key, value] of Object.entries(ATTRIBUTE_LABELS)) {
  // Оригинальное имя (как в schema.json)
  labelMap[key] = value;

  // "item_title" → "Item title"
  if (key.includes('_')) {
    const spaced = key.replace(/_/g, ' ');
    const capitalized = spaced.charAt(0).toUpperCase() + spaced.slice(1);
    labelMap[capitalized] = value;
  }

  // "createdAt" → "Created at" (camelCase → слова)
  if (/[A-Z]/.test(key)) {
    const spaced = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    const capitalized = spaced.charAt(0).toUpperCase() + spaced.slice(1);
    labelMap[capitalized] = value;
  }
}

// ─── Функция перевода DOM-элементов ───

let isTranslating = false;

/** Обходит текстовые узлы внутри label и th, заменяя совпадения на русские названия */
function applyFieldTranslations(): void {
  if (isTranslating) return;
  isTranslating = true;

  try {
    const containers = document.querySelectorAll<HTMLElement>('label, th');

    containers.forEach((container) => {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

      let textNode: Text | null;
      while ((textNode = walker.nextNode() as Text | null)) {
        const raw = textNode.textContent ?? '';
        const trimmed = raw.trim();
        if (trimmed && labelMap[trimmed]) {
          // Сохраняем окружающие пробелы при замене
          textNode.textContent = raw.replace(trimmed, labelMap[trimmed]);
        }
      }
    });
  } finally {
    isTranslating = false;
  }
}

/** Debounced-версия для MutationObserver */
let translateTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleTranslate(): void {
  if (translateTimer) clearTimeout(translateTimer);
  translateTimer = setTimeout(applyFieldTranslations, 150);
}

// ─── Конфигурация Strapi Admin ───

export default {
  config: {
    locales: ['ru'],

    theme: {
      light: {
        colors: {
          alternative100: '#f6ecfc',
          alternative200: '#e0c1f4',
          alternative500: '#ac73e6',
          alternative600: '#9736e8',
          alternative700: '#8312d1',
          buttonNeutral0: '#ffffff',
          buttonPrimary500: '#ba0015',
          buttonPrimary600: '#e2001a',
          danger100: '#fcecea',
          danger200: '#f5c0b8',
          danger500: '#ee5e52',
          danger600: '#d02b20',
          danger700: '#b72b1a',
          neutral0: '#ffffff',
          neutral100: '#f6f6f9',
          neutral1000: '#1a171b',
          neutral150: '#eaeaef',
          neutral200: '#dcdce4',
          neutral300: '#c0c0cf',
          neutral400: '#a5a5ba',
          neutral500: '#8e8ea9',
          neutral600: '#6a5e6e',
          neutral700: '#4a4a6a',
          neutral800: '#32324d',
          neutral900: '#212134',
          primary100: '#eff6ff',
          primary200: '#bfdbfe',
          primary500: '#376fff',
          primary600: '#1656f8',
          primary700: '#1244d4',
          success100: '#eafbe7',
          success200: '#c6f0c2',
          success500: '#5cb176',
          success600: '#328048',
          success700: '#2f6846',
          warning100: '#fdf4dc',
          warning200: '#fae7b9',
          warning500: '#f29d41',
          warning600: '#d9822f',
          warning700: '#be5d01',
        },
      },
      dark: {
        colors: {},
      },
    },

    // Системные переводы Strapi (заголовки таблиц и пр.)
    translations: {
      ru: {
        Id: 'ID',
        Created: 'Создано',
        Updated: 'Обновлено',
        Published: 'Опубликовано',
        Status: 'Статус',
        'content-manager.plugin.name': 'Менеджер контента',
        'content-manager.Search.label': 'Поиск',
        'content-manager.Search.placeholder': 'Поиск...',
        'content-manager.containers.List.addAnEntry': 'Создать запись',
        'content-manager.containers.List.title': 'Список записей',
        'content-manager.containers.Edit.submit': 'Сохранить',
        'content-manager.containers.Edit.delete': 'Удалить',
        'content-manager.containers.Edit.editing': 'Редактирование',
        'content-manager.containers.Edit.create': 'Создание',
        'content-manager.containers.Edit.returnList': 'Назад к списку',
        'content-manager.containers.SettingPage.addField': 'Добавить поле',
        'content-manager.table.headers.id': 'ID',
      },
    },
  },

  bootstrap(app: StrapiApp) {
    console.log(app);

    // Первый запуск перевода после рендера React-приложения
    setTimeout(applyFieldTranslations, 300);

    // Отслеживаем изменения DOM (переходы между страницами, открытие форм)
    const observer = new MutationObserver(scheduleTranslate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
};