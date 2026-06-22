/**
 * catalog-item controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::catalog-item.catalog-item', ({ strapi }) => ({
  // Кастомный endpoint: получить данные для фильтров по категории
  async filterData(ctx) {
    const { categorySlug } = ctx.query;

    // Базовые фильтры
    const filters: any = {
      item_type: 'product',
    };
    if (categorySlug) {
      filters.item_category = { category_slug: categorySlug };
    }

    // Получаем все товары категории с populated characteristics
    const items = await (strapi.documents as any)('api::catalog-item.catalog-item').findMany({
      filters,
      populate: {
        characteristics: {
          populate: {
            characteristic: true,
          },
        },
      },
      limit: 250,
    });

    // Извлекаем уникальных производителей
    const manufacturers = [
      ...new Set(
        items
          .map((item: any) => item.item_manufacturer)
          .filter((m: string) => !!m && m.trim() !== '')
      ),
    ].sort((a: string, b: string) => a.localeCompare(b));

    // Вычисляем цены
    const prices = items
      .map((item: any) => item.item_price)
      .filter((p: any) => p !== undefined && p !== null && Number(p) > 0);
    const hasPrices = prices.length > 0;
    const minPrice = hasPrices ? Math.min(...prices.map(Number)) : null;
    const maxPrice = hasPrices ? Math.max(...prices.map(Number)) : null;

    // Извлекаем характеристики и их значения
    const characteristicsMap: Record<
      number,
      { name: string; slug: string; unit: string | null; values: Set<string> }
    > = {};

    for (const item of items) {
      if (!item.characteristics) continue;
      for (const cv of item.characteristics) {
        if (!cv.characteristic) continue;
        const charId = cv.characteristic.id;
        if (!characteristicsMap[charId]) {
          characteristicsMap[charId] = {
            name: cv.characteristic.characteristic_name,
            slug: cv.characteristic.characteristic_slug,
            unit: cv.characteristic.characteristic_unit || null,
            values: new Set(),
          };
        }
        if (cv.value) {
          characteristicsMap[charId].values.add(cv.value);
        }
      }
    }

    const characteristics = Object.values(characteristicsMap)
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        unit: c.unit,
        values: [...c.values].sort((a, b) => a.localeCompare(b)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      manufacturers,
      hasPrices,
      minPrice,
      maxPrice,
      characteristics,
    };
  },
}));