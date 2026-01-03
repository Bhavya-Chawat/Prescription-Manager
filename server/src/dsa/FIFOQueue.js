// Simple FIFO queue used within each priority lane
class FIFOQueue {
  constructor() {
    this.q = [];
  }
  enqueue(item) {
    this.q.push(item);
  }
  dequeue() {
    return this.q.shift() || null;
  }
  peek() {
    return this.q.length ? this.q[0] : null;
  }
  size() {
    return this.q.length;
  }
  toArray() {
    return [...this.q];
  }
}

module.exports = { FIFOQueue };