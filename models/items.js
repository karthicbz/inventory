const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ItemsSchema = new schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  childOf: { type: schema.Types.ObjectId, ref: "ChildCategory" },
});

module.exports = mongoose.model("Items", ItemsSchema);
