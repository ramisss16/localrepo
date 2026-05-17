const generateRandomNumber = () => {
  return Math.floor(10000 + Math.random() * 90000); // 5-digit
};

const generateUniqueId = async (Model, field, prefix) => {
  let unique = false;
  let id;

  while (!unique) {
    const random = generateRandomNumber();
    id = `${prefix}${random}`;

    const exists = await Model.findOne({ [field]: id });
    if (!exists) {
      unique = true;
    }
  }

  return id;
};

module.exports = generateUniqueId;