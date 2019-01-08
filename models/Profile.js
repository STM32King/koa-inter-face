const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const ProfileSchema = new Schema({
  ProfileIDAdd:{
    type: String,
    required: true
  },
  usersTabID: {
    // 关联数据表
    type: String,
    ref: 'users',
    required: true
  },
  company: {
    type: String
  },
  skills: {
    type: [String],
    required: true
  },
  date: {
    type: String,
    default: Date.now
  }
})



module.exports = Profile = mongoose.model("Profile", ProfileSchema);