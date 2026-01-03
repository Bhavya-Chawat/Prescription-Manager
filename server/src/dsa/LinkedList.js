// LinkedList for prescription items: preserves explicit ordering
class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  append(value) {
    const node = new LinkedListNode(value);
    if (!this.head) {
      this.head = node;
      return node;
    }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
    return node;
  }
  toArray() {
    const arr = [];
    let cur = this.head;
    while (cur) {
      arr.push(cur.value);
      cur = cur.next;
    }
    return arr;
  }
}

module.exports = { LinkedList, LinkedListNode };