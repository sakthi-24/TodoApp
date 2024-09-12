const mongoose = require("mongoose");
const user = require("./user");

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: user },
    tasks: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
        }
    ],
    Total: { type: Number, default: 0},
    satisfactoryLevel: { type: Number, default: 0} 
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("CompletedTask", TaskSchema);
