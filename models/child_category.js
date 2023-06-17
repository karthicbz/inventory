const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ChildCategorySchema = new schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  category: { type: schema.Types.ObjectId, ref: "Category" },
});

ChildCategorySchema.virtual('url').get(function(){
  return(`/inventory/category/${this._id}`);
})

module.exports = mongoose.model("ChildCategory", ChildCategorySchema);
