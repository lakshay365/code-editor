const mongoose = require('mongoose')
const { Schema } = mongoose

const FileSchema = new Schema({
  name: { type: String, required: true },
  content: { type: String }
})

const File = mongoose.model('file', FileSchema)
