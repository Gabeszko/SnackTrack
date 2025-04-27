const getAll = async () => {
  try {
    //business logic
    const data = "Fasz";
    return { status: true, data: data };
  } catch (err) {
    return { status: false, message: "nem sikerült VAGY " + error.message };
  }
};

module.exports = { getAll };
