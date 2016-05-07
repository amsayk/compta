export default function makeAlias(designation){
  return !!designation ? String(designation).toLowerCase().split(/\s+/).join('_') : undefined;
}
