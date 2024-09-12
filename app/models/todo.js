const mongoose = require("mongoose");
const user = require("./user");

const TodoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: user },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'todo', enum:['todo','in-progress', 'done'] },
    date: { type: Date, default: Date.now },
    satisfactoryLevel: { type: Number, default: 0, enum:[0,1,2,3,4,5]}, 
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("Todo", TodoSchema);
