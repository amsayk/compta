import CATEGORIES from '../../data/database/categories';
import GROUPS from '../../data/database/groups';

export default function getCategory(p){
  const cat = CATEGORIES[p._categoryCode] || GROUPS[p._groupCode];
  return cat.name;
}
