import compact from 'lodash.compact';
import memoize from 'lodash.memoize';

export default memoize(function (url){
  const [ apps, ...rest ] = compact(
    url.split(/\//g));

  switch(apps){
    case 'apps':

    if(rest.length === 0){
      return '/';
    }
    else if(rest.length === 1){
      return '/app';
    }else{
      return `/app/${rest[1]}`;

    }

    default: return url;
  }
})
