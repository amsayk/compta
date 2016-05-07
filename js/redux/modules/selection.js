import Relay from 'react-relay';

const TOGGLE = 'compta/selection/TOGGLE';
const TOGGLE_ALL = 'compta/selection/TOGGLE_ALL';
const TOGGLE_NONE = 'compta/selection/TOGGLE_NONE';

const EDIT_START = 'compta/selection/EDIT_START';
const EDIT_STOP = 'compta/selection/EDIT_STOP';

export const Modes = {
  All: 1,
  None: 2,
  Some: 3,
};

const initialState = {
  editing: {

    sales: {
      // [page]: {
      //   mode: Modes.None,
      //   keys: {
      //
      //   }
      // },
    },

    expenses: {
      // [page]: {
      //   mode: Modes.None,
      //   keys: {
      //
      //   }
      // },
    },

    employees: {
      // [page]: {
      //   mode: Modes.None,
      //   keys: {
      //
      //   }
      // },
    },

    customers: {
      // [page]: {
      //   mode: Modes.None,
      //   keys: {
      //
      //   }
      // },
    },

    vendors: {
      // [page]: {
      //   mode: Modes.None,
      //   keys: {
      //
      //   }
      // },
    },

  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: {
            ...(state.editing[action.id][action.page] || {}),
            [action.page]: function(){

              const selectionKeys = {
                ...(state.editing[action.id][action.page] || { keys: {}, }).keys,
                [action.key]: state.editing[action.id][action.page]
                  ? !state.editing[action.id][action.page].keys[action.key]
                  : true,
              };

              return  {
                mode: _calcSelectionMode(
                  selectionKeys, action.len),
                keys: selectionKeys,
              };
            }(),
          },
        }
      };
    case TOGGLE_ALL:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: {
            [action.page]: {
              mode: Modes.All,
              keys: {

              }
            },
          },
        }
      };
    case TOGGLE_NONE:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: {
            [action.page]: {
              mode: Modes.None,
              keys: {

              }
            },
          },
        }
      };
    case EDIT_START:
      return function(){
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: {
            },
          }
        };
      }();
    case EDIT_STOP:
      return function(){
        return {
          ...state,
          editing: {
            ...state.editing,
            [action.id]: undefined,
          }
        };
      }();
    default:
      return state;
  }
}

export function editStart(id) {
  return { type: EDIT_START, id, };
}
export function editStop(id) {
  return { type: EDIT_STOP, id, };
}

export function toggle(id, {page, key}, len) {
  return { type: TOGGLE, id, page, key, len, };
}

export function toggleAll(id, page) {
  return { type: TOGGLE_ALL, id, page, };
}

export function toggleNone(id, page) {
  return { type: TOGGLE_NONE, id, page, };
}

function _calcSelectionMode(selectionKeys, len){
  let selectedCount = 0;
  Object.keys(selectionKeys).forEach(key => {
    const selected = selectionKeys[key];
    if(selected){
      selectedCount++;
    }
  });

  if(selectedCount === len){
    return Modes.All;
  }
  else if(selectedCount === 0){
    return Modes.None;
  }
  else {
    return Modes.Some;
  }
}
