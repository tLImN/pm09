import {
  StrapiResponse,
  StrapiSingleResponse,
  Category,
  CatalogItem,
  AboutPage,
  ContactPage,
  PaymentPage,
  PrivacyPage,
  FaqPage,
} from "./types";

// На сервере используем прямой URL (localhost:1337), на клиенте — публичный.
// STRAPI_INTERNAL_URL не имеет префикса NEXT_PUBLIC_, поэтому доступен только на сервере.
const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText} - ${url}`);
      throw new Error(`Failed to fetch: ${url}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetchAPI<StrapiResponse<Category>>(
      "/categories?populate[parent_category]=true&populate[children_categories][populate][catalog_items]=true&populate[catalog_items]=true&sort[0]=category_slug:asc"
    );
    return res.data || [];
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const res = await fetchAPI<StrapiResponse<Category>>(
      `/categories?filters[category_slug][$eq]=${slug}&populate[catalog_items][populate]=item_images`
    );
    return res.data?.[0] || null;
  } catch {
    return null;
  }
}

export async function getCatalogItems(params?: {
  category?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  priceMin?: number;
  priceMax?: number;
  manufacturer?: string | string[];
  itemType?: "product" | "service";
}): Promise<StrapiResponse<CatalogItem>> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("populate[item_category]", "true");
    searchParams.set("populate[item_images]", "true");

    // Фильтр по типу (product/service)
    if (params?.itemType) {
      searchParams.set("filters[item_type][$eq]", params.itemType);
    }

    if (params?.category) {
      // Сначала проверяем, является ли категория родительской
      const catRes = await fetchAPI<StrapiResponse<Category>>(
        `/categories?filters[category_slug][$eq]=${params.category}&populate[children_categories]=true`
      );
      const cat = catRes.data?.[0];
      
      //if (cat && cat.children_categories && cat.children_categories.length > 0) {
        // Родительская категория — фильтруем по дочерним категориям
      //   const childIds = cat.children_categories.map((c) => c.id);
      //   searchParams.set(
      //     // "filters[item_category][id][$in]",
      //     "filters[item_category][category_slug][$eq]",
      //     childIds.join(",")
      //   );
      // } else {
        // Дочерняя категория — фильтруем по slug
        searchParams.set(
          "filters[item_category][category_slug][$eq]",
          params.category
        );
      //}
    }

    // Фильтр по цене
    if (params?.priceMin !== undefined && params.priceMin !== null) {
      searchParams.set("filters[item_price][$gte]", params.priceMin.toString());
    }
    if (params?.priceMax !== undefined && params.priceMax !== null) {
      searchParams.set("filters[item_price][$lte]", params.priceMax.toString());
    }

    // Фильтр по производителю (один или несколько)
    if (params?.manufacturer) {
      const mfrs = Array.isArray(params.manufacturer) ? params.manufacturer : [params.manufacturer];
      if (mfrs.length === 1) {
        searchParams.set("filters[item_manufacturer][$eq]", mfrs[0]);
      } else {
        mfrs.forEach((m) => {
          searchParams.append("filters[item_manufacturer][$in][]", m);
        });
      }
    }

    if (params?.page) {
      searchParams.set("pagination[page]", params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.set("pagination[pageSize]", params.pageSize.toString());
    }

    if (params?.sort) {
      switch (params.sort) {
        case "title-asc":
          searchParams.set("sort[0]", "item_title:asc");
          break;
        case "title-desc":
          searchParams.set("sort[0]", "item_title:desc");
          break;
        case "newest":
          searchParams.set("sort[0]", "createdAt:desc");
          break;
        case "oldest":
          searchParams.set("sort[0]", "createdAt:asc");
          break;
        case "price-asc":
          searchParams.set("sort[0]", "item_price:asc");
          break;
        case "price-desc":
          searchParams.set("sort[0]", "item_price:desc");
          break;
      }
    }

    return await fetchAPI<StrapiResponse<CatalogItem>>(
      `/catalog-items?${searchParams.toString()}`
    );
  } catch {
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

export async function getFilterData(
  categorySlug?: string
): Promise<{ manufacturers: string[]; hasPrices: boolean; minPrice: number | null; maxPrice: number | null }> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("fields[0]", "item_manufacturer");
    searchParams.set("fields[1]", "item_price");
    searchParams.set("pagination[pageSize]", "250");
    searchParams.set("filters[item_type][$eq]", "product");

    if (categorySlug) {
      searchParams.set(
        "filters[item_category][category_slug][$eq]",
        categorySlug
      );
    }

    const res = await fetchAPI<StrapiResponse<CatalogItem>>(
      `/catalog-items?${searchParams.toString()}`
    );

    const items = res.data || [];

    // Извлекаем уникальные непустые значения производителей
    const manufacturers = items
      .map((item) => item.item_manufacturer)
      .filter((m): m is string => !!m && m.trim() !== "");

    // Проверяем наличие хотя бы одной цены
    const hasPrices = items.some(
      (item) => item.item_price !== undefined && item.item_price !== null
    );

    // Вычисляем min и max цены
    const prices = items
      .map((item) => item.item_price)
      .filter((p): p is number => p !== undefined && p !== null && p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

    return {
      manufacturers: [...new Set(manufacturers)].sort((a, b) =>
        a.localeCompare(b)
      ),
      hasPrices,
      minPrice,
      maxPrice,
    };
  } catch {
    return { manufacturers: [], hasPrices: false, minPrice: null, maxPrice: null };
  }
}

export async function getCatalogItemBySlug(
  slug: string
): Promise<CatalogItem | null> {
  try {
    const res = await fetchAPI<StrapiResponse<CatalogItem>>(
      // `/catalog-items?filters[item_slug][$eq]=${slug}&populate[item_category]=true&populate[item_images]=true&populate[item_description]=true`
      `/catalog-items?filters[item_slug][$eq]=${slug}&populate[item_category]=true&populate[item_images]=true`
    );
    return res.data?.[0] || null;
  } catch {
    return null;
  }
}

export async function searchCatalogItems(
  query: string,
  params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    sort?: string;
    priceMin?: number;
    priceMax?: number;
    manufacturer?: string | string[];
  }
): Promise<StrapiResponse<CatalogItem>> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("_q", query);
    searchParams.set("populate[item_category]", "true");
    searchParams.set("populate[item_images]", "true");

    // Фильтр по категории
    if (params?.category) {
      searchParams.set(
        "filters[item_category][category_slug][$eq]",
        params.category
      );
    }

    // Фильтр по цене
    if (params?.priceMin !== undefined && params.priceMin !== null) {
      searchParams.set("filters[item_price][$gte]", params.priceMin.toString());
    }
    if (params?.priceMax !== undefined && params.priceMax !== null) {
      searchParams.set("filters[item_price][$lte]", params.priceMax.toString());
    }

    // Фильтр по производителю (один или несколько)
    if (params?.manufacturer) {
      const mfrs = Array.isArray(params.manufacturer) ? params.manufacturer : [params.manufacturer];
      if (mfrs.length === 1) {
        searchParams.set("filters[item_manufacturer][$eq]", mfrs[0]);
      } else {
        mfrs.forEach((m) => {
          searchParams.append("filters[item_manufacturer][$in][]", m);
        });
      }
    }

    if (params?.page) {
      searchParams.set("pagination[page]", params.page.toString());
    }
    if (params?.pageSize) {
      searchParams.set("pagination[pageSize]", params.pageSize.toString());
    }

    if (params?.sort) {
      switch (params.sort) {
        case "title-asc":
          searchParams.set("sort[0]", "item_title:asc");
          break;
        case "title-desc":
          searchParams.set("sort[0]", "item_title:desc");
          break;
        case "newest":
          searchParams.set("sort[0]", "createdAt:desc");
          break;
        case "oldest":
          searchParams.set("sort[0]", "createdAt:asc");
          break;
        case "price-asc":
          searchParams.set("sort[0]", "item_price:asc");
          break;
        case "price-desc":
          searchParams.set("sort[0]", "item_price:desc");
          break;
      }
    }

    return await fetchAPI<StrapiResponse<CatalogItem>>(
      `/catalog-items?${searchParams.toString()}`
    );
  } catch {
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

export async function getRelatedItems(
  categoryId: number,
  excludeId: number
): Promise<CatalogItem[]> {
  try {
    const res = await fetchAPI<StrapiResponse<CatalogItem>>(
      `/catalog-items?filters[item_category][id][$eq]=${categoryId}&filters[id][$ne]=${excludeId}&populate[item_images]=true&pagination[limit]=3`
    );
    return res.data || [];
  } catch {
    return [];
  }
}

export async function getHomePageData(): Promise<{
  items: CatalogItem[];
  categories: Category[];
}> {
  try {
    const [itemsRes, categories] = await Promise.all([
      fetchAPI<StrapiResponse<CatalogItem>>(
        "/catalog-items?populate[item_images]=true&pagination[limit]=6"
      ),
      getCategories(),
    ]);
    return { items: itemsRes.data || [], categories };
  } catch {
    return { items: [], categories: [] };
  }
}

// Static pages from Strapi
export async function getAboutPage(): Promise<AboutPage | null> {
  try {
    const res = await fetchAPI<StrapiSingleResponse<AboutPage>>("/about");
    return res.data || null;
  } catch {
    return null;
  }
}

export async function getContactPage(): Promise<ContactPage | null> {
  try {
    const res = await fetchAPI<StrapiSingleResponse<ContactPage>>("/contact");
    return res.data || null;
  } catch {
    return null;
  }
}

export async function getPaymentPage(): Promise<PaymentPage | null> {
  try {
    const res = await fetchAPI<StrapiSingleResponse<PaymentPage>>("/payment");
    return res.data || null;
  } catch {
    return null;
  }
}

export async function getPrivacyPage(): Promise<PrivacyPage | null> {
  try {
    const res = await fetchAPI<StrapiSingleResponse<PrivacyPage>>("/privacy");
    return res.data || null;
  } catch {
    return null;
  }
}

export async function getFaqPage(): Promise<FaqPage | null> {
  try {
    const url = `${STRAPI_URL}/api/faq?populate=faq_items`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}
