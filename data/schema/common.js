/* @flow */
/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

 import {
   GraphQLInterfaceType,
   GraphQLList,
   GraphQLFloat,
   GraphQLID,
   GraphQLInt,
   GraphQLNonNull,
   GraphQLObjectType,
   GraphQLInputObjectType,
   GraphQLSchema,
   GraphQLString,
   GraphQLEnumType,
   GraphQLBoolean,
   GraphQLUnionType,
 } from 'graphql';

 import {
   offsetToCursor,
   fromGlobalId,
   globalIdField,
   mutationWithClientMutationId,
   nodeDefinitions,
   connectionArgs,
   connectionDefinitions,
   connectionFromArray,
   connectionFromArraySlice,
   toGlobalId,
 } from 'graphql-relay';

 import {
  //  GraphQLEmail,
  //  GraphQLURL,
   // GraphQLDateTime,
  //  GraphQLLimitedString,
  //  GraphQLPassword,
 } from 'graphql-custom-types';

// const GraphQLDateTime = GraphQLString;
import GraphQLDateTime from 'graphql-custom-datetype';
const GraphQLEmail = GraphQLString;
const GraphQLURL = GraphQLString;
const GraphQLLimitedString = GraphQLString;
const GraphQLPassword = GraphQLString;

// These two fields appear on all types, so let's only write them once.
export function classNameField(): any {
  return {
    type: new GraphQLNonNull(GraphQLString),
  };
}

// These two fields appear on all types, so let's only write them once.
export function createdField(): any {
  return {
    type: new GraphQLNonNull(GraphQLDateTime),
    description:
      `The ISO 8601 date format of the time that this resource was created.`
  };
}

export function editedField(): any {
  return {
    type: GraphQLDateTime,
    description:
      `The ISO 8601 date format of the time that this resource was edited.`
  };
}

export function objectIdField(): any {
  return {
    type: new GraphQLNonNull(GraphQLString),
    description:
      `The real id.`,
    resolve: (obj) => obj.id,
  };
}

export const OperationKind = new GraphQLEnumType({
  name: 'OperationKind',
  values: {
    DEBIT: {value: 'DEBIT'},
    CREDIT: {value: 'CREDIT'},
  }
});

export const PeriodType = new GraphQLEnumType({
  name: 'Period',
  values: {
    MONTHLY: {value: 'MONTHLY'},
    TRIMESTERLY: {value: 'TRIMESTERLY'},
  }
});

export const legalFormType = new GraphQLEnumType({
  name: 'LegalForm',
  values: {
    SARL: {value: 1},
    SA: {value: 2},
    SNC: {value: 3},
    SARL_AU: {value: 4},
  },
});

export const paymentMethodType = new GraphQLEnumType({
  name: 'PaymentMethod',
  values: {
    Cash: {value: 1},
    Check: {value: 2},
    Creditcard: {value: 3},
  },
});

export const paymentTermsType = new GraphQLEnumType({
  name: 'PaymentTerm',
  values: {
    OnReception: {value: 1},
    Net_15: {value: 2},
    Net_30: {value: 3},
    Net_60: {value: 4},
    Custom: {value: 5},
  },
});

export const companySettingsType = new GraphQLObjectType({
  name: 'CompanySettingsType',
  description: 'Company settings',
  fields: () => ({
    periodType: {
      type: new GraphQLNonNull(PeriodType),
    },
    closureEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    closureDate: {
      type: GraphQLDateTime,
    },
  }),
});


export const companySalesSettingsType = new GraphQLObjectType({
  name: 'CompanySaleSettings',
  description: 'Company sales settings',
  fields: () => ({
    discountEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    defaultDepositToAccountCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    preferredInvoiceTerms: {
      type: new GraphQLNonNull(paymentTermsType),
    },
    enableCustomTransactionNumbers: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    enableServiceDate: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    showProducts: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    showRates: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    trackInventory: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    defaultIncomeAccountCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const companyExpensesSettingsType = new GraphQLObjectType({
  name: 'CompanyExpenseSettings',
  description: 'Company expenses settings',
  fields: () => ({
    defaultExpenseAccountCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    preferredPaymentMethod: {
      type: new GraphQLNonNull(paymentMethodType),
    },
  }),
});

export const companyPaymentsSettingsType = new GraphQLObjectType({
  name: 'CompanyPaymentSettings',
  description: 'Company payments settings',
  fields: () => ({
    defaultDepositToAccountCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    preferredPaymentMethod: {
      type: new GraphQLNonNull(paymentMethodType),
    },
  }),
});

export const discountValueType = new GraphQLEnumType({
  name: 'DiscountValue',
  values: {
    Value: {value: 1},
    Percent: {value: 2},
  },
});

export const discountPartType = new GraphQLObjectType({
  name: 'DiscountPart',
  fields: () => ({
    type: {
      type: discountValueType,
    },
    value: {
      type: GraphQLFloat,
    },
  }),
});

export const discountPartInputType = new GraphQLInputObjectType({
  name: 'DiscountPartInput',
  fields: () => ({
    type: {
      type: discountValueType,
    },
    value: {
      type: GraphQLFloat,
    },
  }),
});

export const personType = new GraphQLInterfaceType({
  name: 'Person',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    image: {
      type: GraphQLString,
    },
    title: {
      type: GraphQLString,
    },
    givenName: {
      type: GraphQLString,
    },
    middleName: {
      type: GraphQLString,
    },
    familyName: {
      type: GraphQLString,
    },
    affiliation: {
      type: GraphQLString,
    },
    emails: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    mobile: {
      type: GraphQLString,
    },
    fax: {
      type: GraphQLString,
    },
    website: {
      type: GraphQLString,
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    updatedAt: {
      type: GraphQLDateTime,
    },
    objectId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const expenseOrPaymentOfBillsType = new GraphQLInterfaceType({
  name: 'ExpenseOrPaymentOfBills',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    payee: {
      type: personType,
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    memo: {
      type: GraphQLString,
    },
    files: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLURL))),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    updatedAt: {
      type: GraphQLDateTime,
    },
    objectId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export const transactionStatusType = new GraphQLEnumType({
  name: 'TransactionStatus',
  values: {
    Open: {value: 1},
    Closed: {value: 2},
    Overdue: {value: 3},
  },
});

export const productKind = new GraphQLEnumType({
  name: 'ProductKind',
  values: {
    Product: {value: 1},
    Service: {value: 2},
  },
});

export const filterArgs = {
  type: {
    type: GraphQLString,
  },
  status: {
    type: GraphQLString,
  },
  offset: {
    type: GraphQLInt,
  },
  limit: {
    type: GraphQLInt,
  },
  from: {
    type: GraphQLDateTime,
  },
  to: {
    type: GraphQLDateTime,
  },
  sortKey: {
    type: GraphQLString,
  },
  sortDir: {
    type: GraphQLInt,
  },
  customer: {
    type: GraphQLString,
  },
  payee: {
    type: GraphQLString,
  },
  _rev: {
    type: GraphQLInt,
  }
};

export const companySettingsInputType = new GraphQLInputObjectType({
  name: 'CompanySettingsInputType',
  description: 'Company settings',
  fields: () => ({
    periodType: {
      type: PeriodType,
    },
    closureEnabled: {
      type: GraphQLBoolean,
    },
    closureDate: {
      type: GraphQLDateTime,
    },
  }),
});

export const companySalesSettingsInputType = new GraphQLInputObjectType({
  name: 'CompanySaleSettingsInputType',
  description: 'Company sales settings',
  fields: () => ({
    discountEnabled: {
      type: GraphQLBoolean,
    },
    defaultDepositToAccountCode: {
      type: GraphQLString,
    },
    preferredInvoiceTerms: {
      type: paymentTermsType,
    },
    enableCustomTransactionNumbers: {
      type: GraphQLBoolean,
    },
    enableServiceDate: {
      type: GraphQLBoolean,
    },
    showProducts: {
      type: GraphQLBoolean,
    },
    showRates: {
      type: GraphQLBoolean,
    },
    trackInventory: {
      type: GraphQLBoolean,
    },
    defaultIncomeAccountCode: {
      type: GraphQLString,
    },
  }),
});

export const companyExpensesSettingsInputType = new GraphQLInputObjectType({
  name: 'CompanyExpenseSettingsInputType',
  description: 'Company expenses settings',
  fields: () => ({
    defaultExpenseAccountCode: {
      type: GraphQLString,
    },
    preferredPaymentMethod: {
      type: paymentMethodType,
    },
  }),
});

export const companyPaymentsSettingsInputType = new GraphQLInputObjectType({
  name: 'CompanyPaymentSettingsInputType',
  description: 'Company payments settings',
  fields: () => ({
    defaultDepositToAccountCode: {
      type: GraphQLString,
    },
    preferredPaymentMethod: {
      type: paymentMethodType,
    },
  }),
});

export const invoiceItemLineInputType = new GraphQLInputObjectType({
  name: 'InvoiceItemLineInputType',
  fields: () => ({
    className:{
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    incomeAccountCode: {
      type: GraphQLString,
    },
  })
});

export const invoiceItemInputType = new GraphQLInputObjectType({
  name: 'InvoiceItemInputType',
  fields: () => ({
    index: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    date: {
      type: GraphQLDateTime,
    },
    item: {
      type: invoiceItemLineInputType,
    },
    description: {
      type: GraphQLString,
    },
    qty: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    rate: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    discountPart: {
      type: discountPartInputType,
    },
  }),
});

export const parseObjectInputFieldType = new GraphQLInputObjectType({
  name: 'ParseObjectInputFieldType',
  fields: () => ({
    className:{
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
});

export const parseTypedObjectInputFieldType = function(){
  let _count = 0;

  return (types) => {
    const key = _count++;

    const _enum = new GraphQLEnumType({
      name: 'ParseTypedObjectInputFieldTypeEnum' + key,
      values: types.reduce((values, [ key, value ]) => ({ ...values, [key]: { value, }, }), {}),
    });

    return new GraphQLInputObjectType({
      name: 'ParseTypedObjectInputFieldType' + key,
      fields: () => ({
        type: {
          type: new GraphQLNonNull(_enum),
        },
        className:{
          type: new GraphQLNonNull(GraphQLString),
        },
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      })
    })
  };
}();

export const billItemInputType = new GraphQLInputObjectType({
  name: 'BillItemInputType',
  fields: () => ({
    index: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    accountCode: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});

export const saleItemLineInputType = new GraphQLInputObjectType({
  name: 'SaleItemLineInputType',
  fields: () => ({
    className:{
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
});

export const saleItemInputType = new GraphQLInputObjectType({
  name: 'SaleItemInputType',
  fields: () => ({
    index: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    date: {
      type: GraphQLDateTime,
    },
    item: {
      type: saleItemLineInputType,
    },
    description: {
      type: GraphQLString,
    },
    qty: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    rate: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    discountPart: {
      type: discountPartInputType,
    },
  }),
});

export const expenseItemInputType = new GraphQLInputObjectType({
  name: 'ExpenseItemInputType',
  fields: () => ({
    index: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    accountCode: {
      type: new GraphQLNonNull(GraphQLString),
    },
    description: {
      type: GraphQLString,
    },
    amount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  }),
});

export const paymentOfInvoicesItemInputType = new GraphQLInputObjectType({
  name: 'PaymentOfInvoicesItemInputType',
  fields: () => ({
    index: {type: new GraphQLNonNull(GraphQLInt)},
    invoiceId: {type: new GraphQLNonNull(GraphQLString)},
    amount: {type: new GraphQLNonNull(GraphQLFloat)},
  }),
});

export const paymentOfBillsItemInputType = new GraphQLInputObjectType({
  name: 'PaymentOfBillsItemInputType',
  fields: () => ({
    index: {type: new GraphQLNonNull(GraphQLInt)},
    billId: {type: new GraphQLNonNull(GraphQLString)},
    amount: {type: new GraphQLNonNull(GraphQLFloat)},
  }),
});

export const fieldValueType = new GraphQLInputObjectType({
  name: 'FieldValueType',
  fields: () => ({
    fieldName: {type: new GraphQLNonNull(GraphQLString)},
    value: {type: GraphQLString},
  }),
});
