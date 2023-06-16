const mongoose = require("mongoose");

const schema = mongoose.Schema;

const CategorySchema = new schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  childs: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChildCategories" }],
});

module.exports = mongoose.model("Category", CategorySchema);
