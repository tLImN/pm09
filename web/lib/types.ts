// Strapi Response
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

// Strapi Media
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  url: string;
  formats?: Record<
    string,
    { url: string; width: number; height: number }
  >;
}

// Strapi Rich Text Block
export interface StrapiBlockChild {
  type: string;
  text?: string;
  children?: StrapiBlockChild[];
}

export interface StrapiBlock {
  type: "paragraph" | "list" | "heading" | "list-item";
  children?: StrapiBlockChild[];
  format?: string;
  level?: number;
}

// Category
export interface Category {
  id: number;
  documentId: string;
  category_title: string;
  category_slug: string;
  parent_category?: Category | null;
  children_categories?: Category[];
  catalog_items?: CatalogItem[];
  category_description?: StrapiBlock[];
}

// Characteristic (справочник характеристик)
export interface Characteristic {
  id: number;
  documentId: string;
  characteristic_name: string;
  characteristic_slug: string;
  characteristic_unit?: string;
}

// Значение характеристики (component)
export interface CharacteristicValue {
  id: number;
  characteristic?: Characteristic;
  value: string;
}

// Данные для фильтров
export interface FilterData {
  manufacturers: string[];
  hasPrices: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  characteristics: {
    name: string;
    slug: string;
    unit: string | null;
    values: string[];
  }[];
}

// Catalog Item
export interface CatalogItem {
  id: number;
  documentId: string;
  item_title: string;
  item_slug: string;
  item_type: "product" | "service";
  item_category?: Category[];
  item_price?: number;
  item_manufacturer?: string;
  item_description?: StrapiBlock[];
  item_images?: StrapiMedia[];
  characteristics?: CharacteristicValue[];
}

// About Page (singleType)
export interface AboutPage {
  content?: StrapiBlock[];
}

// Contact Page (singleType)
export interface ContactPage {
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  working_hours?: string;
}

// Payment Page (singleType)
export interface PaymentPage {
  content?: StrapiBlock[];
}

// Privacy/Licenses Page (singleType)
export interface PrivacyPage {
  content?: StrapiBlock[];
}

// FAQ Item
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// FAQ Page (singleType)
export interface FaqPage {
  faq_items?: FaqItem[];
}

// Contact Form Data
export interface ContactFormData {
  name: string;
  tel: string;
  email: string;
  message: string;
}
