// Greedy FEFO allocator: earliest expiry first for partial/full dispensing
function greedyAllocate(requiredQty, batches) {
  // batches: [{ batchId, availableQty, expiryDate }]
  const sorted = [...batches].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
  const allocations = [];
  let remaining = requiredQty;
  for (const b of sorted) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, b.availableQty);
    if (take > 0) {
      allocations.push({ batchId: b.batchId, quantity: take });
      remaining -= take;
    }
  }
  return { allocations, remaining };
}

module.exports = { greedyAllocate };