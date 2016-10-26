import messages from '../messages';
import { changeWithKey as change, } from 'redux-form';
import moment from 'moment';

export const Dates = (intl) => ([

  {
    id: 12,
    name: intl.formatMessage(messages['Dates_Last_x_days'], {days: 30,}),
    getValue(){
      return{
        from: moment().subtract(30, 'days').toDate(),
        to: undefined,
      };
    }
  },

  // {
  //   id: 1,
  //   name: intl.formatMessage(messages['Dates_Last_x_days'], {days: 365,}),
  //   getValue(){
  //     return{
  //       from: moment().subtract(365, 'days').toDate(),
  //       to: undefined,
  //     };
  //   }
  // },

  // {
  //   id: 2,
  //   name: intl.formatMessage(messages['Dates_Today']),
  //   getValue(){
  //     return{
  //       from: moment().toDate(),
  //       to: moment().toDate(),
  //     };
  //   }
  // },

  // {
  //   id: 3,
  //   name: intl.formatMessage(messages['Dates_Yesterday']),
  //   getValue(){
  //     return{
  //       from: moment().subtract(1, 'day').toDate(),
  //       to: moment().subtract(1, 'day').toDate(),
  //     };
  //   }
  // },

  // {
  //   id: 4,
  //   name: intl.formatMessage(messages['Dates_This_week']),
  //   getValue(){
  //     return{
  //       from: moment().startOf('isoWeek').toDate(),
  //       to: moment().endOf('isoWeek').toDate(),
  //     };
  //   }
  // },

  {
    id: 5,
    name: intl.formatMessage(messages['Dates_This_month']),
    getValue(){
      return{
        from: moment().startOf('month').toDate(),
        to: moment().endOf('month').toDate(),
      };
    }
  },

  {
    id: 6,
    name: intl.formatMessage(messages['Dates_This_quarter']),
    getValue(){
      return{
        from: moment().startOf('quarter').toDate(),
        to: moment().endOf('quarter').toDate(),
      };
    }
  },

  {
    id: 7,
    name: intl.formatMessage(messages['Dates_This_year']),
    getValue(){
      return{
        from: moment().startOf('year').toDate(),
        to: moment().endOf('year').toDate(),
      };
    }
  },

  // {
  //   id: 8,
  //   name: intl.formatMessage(messages['Dates_Last_week']),
  //   getValue(){
  //     return{
  //       from: moment().subtract(1, 'week').startOf('isoWeek').toDate(),
  //       to: moment().subtract(1, 'week').endOf('isoWeek').toDate(),
  //     };
  //   }
  // },

  {
    id: 9,
    name: intl.formatMessage(messages['Dates_Last_month']),
    getValue(){
      return{
        from: moment().subtract(1, 'month').startOf('month').toDate(),
        to: moment().subtract(1, 'month').endOf('month').toDate(),
      };
    }
  },

  {
    id: 10,
    name: intl.formatMessage(messages['Dates_Last_quarter']),
    getValue(){
      return{
        from: moment().subtract(1, 'quarter').startOf('quarter').toDate(),
        to: moment().subtract(1, 'quarter').endOf('quarter').toDate(),
      };
    }
  },

  {
    id: 11,
    name: intl.formatMessage(messages['Dates_Last_year']),
    getValue(){
      return{
        from: moment().subtract(1, 'year').startOf('year').toDate(),
        to: moment().subtract(1, 'year').endOf('year').toDate(),
      };
    }
  },


]);
