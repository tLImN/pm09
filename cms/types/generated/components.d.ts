import type { Schema, Struct } from '@strapi/strapi';

export interface CharacteristicsCharacteristicValue
  extends Struct.ComponentSchema {
  collectionName: 'components_characteristics_characteristic_values';
  info: {
    description: '\u041F\u0430\u0440\u0430 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0430-\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u0442\u043E\u0432\u0430\u0440\u0430';
    displayName: '\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0445\u0430\u0440\u0430\u043A\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043A\u0438';
    icon: 'bulletList';
  };
  attributes: {
    characteristic: Schema.Attribute.Relation<
      'manyToOne',
      'api::characteristic.characteristic'
    >;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface FaqFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_faq_faq_items';
  info: {
    description: '';
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'characteristics.characteristic-value': CharacteristicsCharacteristicValue;
      'faq.faq-item': FaqFaqItem;
    }
  }
}
