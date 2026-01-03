// Multi-level priority queue: 4 levels with FIFO per level
const { FIFOQueue } = require('./FIFOQueue');

class PriorityQueue {
  constructor(levels = 4) {
    this.levels = Array.from({ length: levels }, () => new FIFOQueue());
  }
  // priority: 0 (highest) .. levels-1 (lowest)
  push(priority, item) {
    if (priority < 0 || priority >= this.levels.length) throw new Error('Invalid priority');
    this.levels[priority].enqueue(item);
  }
  popNext() {
    for (let i = 0; i < this.levels.length; i++) {
      const entry = this.levels[i].dequeue();
      if (entry) return { priority: i, item: entry };
    }
    return null;
  }
  size() {
    return this.levels.reduce((acc, q) => acc + q.size(), 0);
  }
  snapshot() {
    return this.levels.map((q) => q.toArray());
  }
}

module.exports = { PriorityQueue };