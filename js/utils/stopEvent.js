export default function stopEvent(e){
  if(e){
    e.stopPropagation();
    e.preventDefault();
  }
}
