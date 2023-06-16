const mongoose = require("mongoose");

const schema = mongoose.Schema;

const CategorySchema = new schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

CategorySchema.virtual('url').get(function(){
  return(`/inventory/${this._id}`);
});

module.exports = mongoose.model("Category", CategorySchema);
