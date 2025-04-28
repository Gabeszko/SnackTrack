function calculateFullness(slots) {
  const filled = slots.reduce(
    (acc, slot) => acc + (slot.product ? slot.quantity : 0),
    0
  );
  const total = slots.reduce(
    (acc, slot) => acc + (slot.product ? slot.capacity : 0),
    0
  );

  if (total === 0) return 0;
  return Math.round((filled / total) * 100);
}

module.exports = calculateFullness;
