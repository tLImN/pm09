import {
  StrapiResponse,
  StrapiSingleResponse,
  Category,
  CatalogItem,
  AboutPage,
  ContactPage,
  PaymentPage,
  PrivacyPage,
} from "./types";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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
      "/categories?populate[parent_category]=true&populate[children_categories]=true&sort[0]=category_slug:asc"
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
}): Promise<StrapiResponse<CatalogItem>> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.set("populate[item_category]", "true");
    searchParams.set("populate[item_images]", "true");

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
      }
    }

    return await fetchAPI<StrapiResponse<CatalogItem>>(
      `/catalog-items?${searchParams.toString()}`
    );
  } catch {
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
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
