const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ChildCategorySchema = new schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  items: [{ type: mongoose.Types.ObjectId, ref: "Items" }],
});

module.exports = mongoose.model("ChildCategory", ChildCategorySchema);
