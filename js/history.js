import { createHistory, useBeforeUnload, } from 'history';

import { useRouterHistory, } from 'react-router';

import { getBeforeUnloadMessage, } from './utils/unbeforeunload';

const history = useBeforeUnload(useRouterHistory(createHistory))();

history.listenBeforeUnload(function () {
  return process.env.NODE_ENV !== 'production' ? null : getBeforeUnloadMessage();
});

export default history;
