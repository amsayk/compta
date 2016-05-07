export default function getFieldValue(el, defaultValue){
  if(el.pristine){
    return el.initialValue ? el.initialValue : defaultValue;
  }
  return el.value ? el.value : defaultValue;
}
