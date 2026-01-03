// HashTable: O(1) average for key lookups
class HashTable {
  constructor() {
    this.cache = new Map();
  }
  set(key, value) {
    this.cache.set(String(key), value);
  }
  get(key) {
    return this.cache.get(String(key)) || null;
  }
  has(key) {
    return this.cache.has(String(key));
  }
}

module.exports = { HashTable };