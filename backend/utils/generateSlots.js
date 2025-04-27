const generateSlots = (rows, cols) => {
    const slots = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= cols; c++) {
        slots.push({
          slotCode: `${letters[r]}${c}`,
          product: null,
          quantity: 0,
          capacity: 0,
          price: 0
        });
      }
    }
    return slots;
  };
  
module.exports = generateSlots;
  