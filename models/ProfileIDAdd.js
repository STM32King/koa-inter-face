const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const countSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
})


module.exports = counters = mongoose.model("counter", countSchema);