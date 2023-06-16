const mongoose = require("mongoose");

const schema = mongoose.Schema;

const CategorySchema = new schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

module.exports = mongoose.model("Category", CategorySchema);
