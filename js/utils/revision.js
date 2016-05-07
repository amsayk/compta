let current = 0;
export default {
  incrementAndGet(){
    const value = current;
    current++;
    return value;
  },
}
