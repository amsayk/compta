/* @flow */
/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

 const {
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
 } = require('graphql');

 const {
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
 } = require('graphql-relay');

 // const {
 //  //  GraphQLEmail,
 //  //  GraphQLURL,
 //   // GraphQLDateTime,
 //  //  GraphQLLimitedString,
 //  //  GraphQLPassword,
 // } = require('graphql-custom-types');

// const GraphQLDateTime = GraphQLString;
const GraphQLDateTime = require('graphql-custom-datetype');
const GraphQLEmail = GraphQLString;
const GraphQLURL = GraphQLString;
const GraphQLLimitedString = GraphQLString;
const GraphQLPassword = GraphQLString;

// These two fields appear on all types, so let's only write them once.
module.exports.classNameField = function classNameField(): any {
  return {
    type: new GraphQLNonNull(GraphQLString),
  };
}

module.exports.activityField = function activityField(defaultValue = undefined): any {
  return {
    type: new GraphQLNonNull(GraphQLBoolean),
    resolve: (obj) => obj.has('active') ? obj.get('active') : (typeof defaultValue !== 'undefined' ? defaultValue : true)
  };
}

// These two fields appear on all types, so let's only write them once.
module.exports.createdField = function createdField(): any {
  return {
    type: new GraphQLNonNull(GraphQLDateTime),
    description:
      `The ISO 8601 date format of the time that this resource was created.`
  };
}

module.exports.editedField = function editedField(): any {
  return {
    type: GraphQLDateTime,
    description:
      `The ISO 8601 date format of the time that this resource was edited.`
  };
}

module.exports.objectIdField = function objectIdField(): any {
  return {
    type: new GraphQLNonNull(GraphQLString),
    description:
      `The real id.`,
    resolve: (obj) => obj.id,
  };
}

const OperationKind = new GraphQLEnumType({
  name: 'OperationKind',
  values: {
    DEBIT: {value: 'DEBIT'},
    CREDIT: {value: 'CREDIT'},
  }
});

module.exports.OperationKind = OperationKind;

const PeriodType = new GraphQLEnumType({
  name: 'Period',
  values: {
    MONTHLY: {value: 'MONTHLY'},
    // TRIMESTERLY: {value: 'TRIMESTERLY'},
    QUARTERLY: {value: 'QUARTERLY'},
  }
});

module.exports.PeriodType = PeriodType;

const VATRegimeType = new GraphQLEnumType({
  name: 'VATRegime',
  values: {
    // Encaissement: {value: 1, },
    Standard: {value: 1, },
    Debit: {value: 2, },
  }
});

module.exports.VATRegimeType = VATRegimeType;

module.exports.legalFormType = new GraphQLEnumType({
  name: 'LegalForm',
  values: {
    SARL: {value: 1},
    SA: {value: 2},
    SNC: {value: 3},
    SARL_AU: {value: 4},
  },
});

const paymentMethodType = new GraphQLEnumType({
  name: 'PaymentMethod',
  values: {
    Cash: {value: 1},
    Check: {value: 2},
    Creditcard: {value: 3},
  },
});

module.exports.paymentMethodType = paymentMethodType;

const paymentTermsType = new GraphQLEnumType({
  name: 'PaymentTerm',
  values: {
    OnReception: {value: 1},
    Net_15: {value: 2},
    Net_30: {value: 3},
    Net_60: {value: 4},
    Custom: {value: 5},
  },
});

module.exports.paymentTermsType = paymentTermsType;

module.exports.companySettingsType = new GraphQLObjectType({
  name: 'CompanySettingsType',
  description: 'Company settings',
  fields: () => ({
    periodType: {
      type: PeriodType,
    },
    closureEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    closureDate: {
      type: GraphQLDateTime,
    },
  }),
});


module.exports.companySalesSettingsType = new GraphQLObjectType({
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

module.exports.companyExpensesSettingsType = new GraphQLObjectType({
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

module.exports.companyPaymentsSettingsType = new GraphQLObjectType({
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

const discountValueType = new GraphQLEnumType({
  name: 'DiscountValue',
  values: {
    Value: {value: 1},
    Percent: {value: 2},
  },
});

module.exports.discountValueType = discountValueType;

const discountPartType = new GraphQLObjectType({
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

module.exports.discountPartType = discountPartType;

const discountPartInputType = new GraphQLInputObjectType({
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

module.exports.discountPartInputType = discountPartInputType;

const personType = new GraphQLInterfaceType({
  name: 'Person',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    displayName: {
      type: new GraphQLNonNull(GraphQLString),
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

module.exports.personType = personType;

module.exports.expenseOrPaymentOfBillsType = new GraphQLInterfaceType({
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

module.exports.transactionStatusType = new GraphQLEnumType({
  name: 'TransactionStatus',
  values: {
    Open: {value: 1},
    Closed: {value: 2},
    Overdue: {value: 3},
    Partial: {value: 4},
  },
});

module.exports.productKind = new GraphQLEnumType({
  name: 'ProductKind',
  values: {
    Product: {value: 1},
    Service: {value: 2},
  },
});

module.exports.filterArgs = {
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

module.exports.companySettingsInputType = new GraphQLInputObjectType({
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

module.exports.companySalesSettingsInputType = new GraphQLInputObjectType({
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

module.exports.companyExpensesSettingsInputType = new GraphQLInputObjectType({
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

module.exports.companyPaymentsSettingsInputType = new GraphQLInputObjectType({
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

const invoiceItemLineInputType = new GraphQLInputObjectType({
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

module.exports.invoiceItemLineInputType = invoiceItemLineInputType;

module.exports.invoiceItemInputType = new GraphQLInputObjectType({
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
    VATPart: {
      type: VATPartInputType,
    },

  }),
});

module.exports.parseObjectInputFieldType = new GraphQLInputObjectType({
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

module.exports.parseTypedObjectInputFieldType = function(){
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

module.exports.billItemInputType = new GraphQLInputObjectType({
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
    VATPart: {
      type: VATPartInputType,
    },
  }),
});

const saleItemLineInputType = new GraphQLInputObjectType({
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

module.exports.saleItemLineInputType = saleItemLineInputType;

module.exports.saleItemInputType = new GraphQLInputObjectType({
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
    VATPart: {
      type: VATPartInputType,
    },

  }),
});

module.exports.expenseItemInputType = new GraphQLInputObjectType({
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
    VATPart: {
      type: VATPartInputType,
    },
  }),
});

module.exports.paymentOfInvoicesItemInputType = new GraphQLInputObjectType({
  name: 'PaymentOfInvoicesItemInputType',
  fields: () => ({
    index: {type: new GraphQLNonNull(GraphQLInt)},
    invoiceId: {type: new GraphQLNonNull(GraphQLString)},
    amount: {type: new GraphQLNonNull(GraphQLFloat)},
  }),
});

module.exports.paymentOfBillsItemInputType = new GraphQLInputObjectType({
  name: 'PaymentOfBillsItemInputType',
  fields: () => ({
    index: {type: new GraphQLNonNull(GraphQLInt)},
    billId: {type: new GraphQLNonNull(GraphQLString)},
    amount: {type: new GraphQLNonNull(GraphQLFloat)},
  }),
});

module.exports.fieldValueType = new GraphQLInputObjectType({
  name: 'FieldValueType',
  fields: () => ({
    fieldName: {type: new GraphQLNonNull(GraphQLString)},
    value: {type: GraphQLString},
  }),
});

module.exports.saleOpInterfaceType = new GraphQLInterfaceType({
  name: 'SaleOp',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    memo: {
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

module.exports.expenseOpInterfaceType = new GraphQLInterfaceType({
  name: 'ExpenseOp',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    date: {
      type: new GraphQLNonNull(GraphQLDateTime),
    },
    memo: {
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

module.exports.fileItemInputType = new GraphQLInputObjectType({
  name: 'FileItemInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    size: {
      type: GraphQLFloat,
    },
    dataBase64: {
      type: GraphQLString,
    },
    isNull: {
      type: GraphQLBoolean,
    },
  }),
});

module.exports.companyVATSettingsType = new GraphQLObjectType({
  name: 'CompanyVATSettings',
  fields: () => ({
    enabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    startDate: {
      type: GraphQLDateTime,
    },
    agency: {
      type: GraphQLString,
    },
    IF: {
      type: GraphQLString,
    },
    frequency: {
      type: PeriodType,
    },
    regime: {
      type: VATRegimeType,
    },
    percentages: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(VATPercentageType))),
    },
  }),
});

const VATPercentageType = new GraphQLObjectType({
  name: 'VATPercentage',
  fields: () => ({
    value: {
      type: VATType,
    }
  }),
});

module.exports.VATPercentageType = VATPercentageType;

const VATInputType = new GraphQLEnumType({
  name: 'VATInput',
  values: {
    HT: {value: 1, },
    TTC: {value: 2, },
    NO_VAT: {value: 3, },
  }
});

module.exports.VATInputType = VATInputType;

const VATPartType = new GraphQLObjectType({
  name: 'VATPart',
  fields: () => ({
    inputType: {
      type: VATInputType,
    },
    value: {
      type: VATType,
    },
  }),
});

module.exports.VATPartType = VATPartType;

const VATPartInputType = new GraphQLInputObjectType({
  name: 'VATPartInput',
  fields: () => ({
    inputType: {
      type: VATInputType,
    },
    value: {
      type: VATType,
    },
  }),
});

module.exports.VATPartInputType = VATPartInputType;

const VATType = new GraphQLEnumType({
  name: 'VAT',
  values: {
    Value_20: {value: 1, },
    Value_14: {value: 2, },
    Value_10: {value: 3, },
    Value_Exempt: {value: 4, },
    Value_7: {value: 5, },
  }
});

module.exports.VATType = VATType;

module.exports.productItemType = new GraphQLInterfaceType({
  name: 'ItemLine',
  fields: () => ({
    index: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    date: {
      type: GraphQLDateTime,
    },
    // item: {
    //   type: saleItemLineInputType,
    // },
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
      type: discountPartType,
    },
    VATPart: {
      type: VATPartType,
    },
  }),
});

module.exports.accountItemType = new GraphQLInterfaceType({
  name: 'AccountLine',
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
    VATPart: {
      type: VATPartType,
    },
  }),
});
