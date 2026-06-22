/**
 * catalog-item router
 */

export default {
  routes: [
    // Кастомный роут ДО стандартных (чтобы не конфликтовал)
    {
      method: 'GET',
      path: '/catalog-items/filter-data',
      handler: 'catalog-item.filterData',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Стандартные CRUD роуты
    {
      method: 'GET',
      path: '/catalog-items',
      handler: 'catalog-item.find',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/catalog-items/:id',
      handler: 'catalog-item.findOne',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'POST',
      path: '/catalog-items',
      handler: 'catalog-item.create',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'PUT',
      path: '/catalog-items/:id',
      handler: 'catalog-item.update',
      config: { policies: [], middlewares: [] },
    },
    {
      method: 'DELETE',
      path: '/catalog-items/:id',
      handler: 'catalog-item.delete',
      config: { policies: [], middlewares: [] },
    },
  ],
};
