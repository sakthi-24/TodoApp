const cron = require('node-cron');
const mongoose = require('mongoose');
const todo = require('../models/todo');
const user = require('../models/user');
const completedTask = require('../models/completedTask');
const { floor } = require('lodash');

cron.schedule('0 0 * * *', async () => {
  console.log("working every minute");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userList = await user.find().select({ _id: 1 });

    const bulkOps = [];

    for (const element of userList) {
      const userId = element._id;

      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      const todoList = await todo.find({
        userId: userId,
        $expr: {
          $gte: ["$createdAt", date],
        },
        status: 'done'
      });

      if (todoList.length) {
        const taskList = await completedTask.findOne({ userId: userId });

        const taskDescriptions = todoList.map((item) => item.description);
        const totalSatisfactory = todoList.reduce((sum, item) => sum + item.satisfactoryLevel, 0);
        const avgSatisfactory = floor(totalSatisfactory / taskDescriptions.length);

        if (taskList) {
          bulkOps.push({
            updateOne: {
              filter: { _id: taskList._id },
              update: {
                $push: { tasks: { $each: taskDescriptions } },
                $set: { satisfactoryLevel: avgSatisfactory },
                $inc: { total: taskDescriptions.length }
              }
            }
          });
        } else {
          bulkOps.push({
            insertOne: {
              document: {
                userId: userId,
                tasks: taskDescriptions,
                total: taskDescriptions.length,
                satisfactoryLevel: avgSatisfactory
              }
            }
          });
        }
      }
    }

    if (bulkOps.length > 0) {
      await completedTask.bulkWrite(bulkOps, { session });
    }

    await session.commitTransaction();
    session.endSession();
    console.log("Transaction committed successfully.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction aborted due to an error: ", error);
  }
});
