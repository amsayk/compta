export default function isType(obj, className){
  return obj.__type === className || obj.className.indexOf(className) !== -1;
}
