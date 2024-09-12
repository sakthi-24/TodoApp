const Todo = require("../models/todo");

exports.createTask = async (title, description, userId) => {
  try {
    const newTask = new Todo({ title, description, userId });
    return newTask.save();
  } catch (error) {
    throw new Error("Cannot create task");
  }
};

exports.updateTask = async (
  id,
  title,
  description,
  userId
) => {
  try {
    const task = await Todo.findOne({ _id: id });
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId.toString() !== userId.toString()) {
      throw new Error("Unauthorized User");
    }
    if (task.status === "done") {
      throw new Error(
        "Cannot add satisfactory level until you complete the task"
      );
    }
    task.title = title;
    task.description = description;
    return task.save();
  } catch (error) {
    throw new Error("Cannot update Task");
  }
};

exports.updateStatus = async (id, satisfactoryLevel, status) => {
  try {
    const task = await Todo.findOne({ _id: id });
    if (!task) {
      throw new Error("Task not found");
    }
    if (satisfactoryLevel && status !== "done") {
      throw new Error(
        "Cannot add satisfactory level until you complete the task"
      );
    }

    if (satisfactoryLevel && (satisfactoryLevel < 0 || satisfactoryLevel > 5)) {
      throw new Error("Satisfactory Level should be between 1 to 5");
    }
    task.status = status;
    task.satisfactoryLevel = satisfactoryLevel;
    return task.save();
  } catch (error) {
    throw new Error("Cannot update status of the Task");
  }
};

exports.deleteTask = async (id) => {
  try {
    const task = await Todo.findOne({ _id: id });
    if (!task) {
      throw new Error("Task not found");
    }
    return Todo.findOneAndDelete({ _id: id });
  } catch (error) {
    throw new Error("Cannot update Task");
  }
};

exports.listTask = async (req) => {
  try {
    let { status, limit, search, sortBy, sortOrder, skip } = req.query;
    const userId = req.user.userId;
    console.log(userId, status, limit, search, sortBy, sortOrder, skip);
    sortOrder = sortOrder === "asc" ? 1 : -1;
    search = `.*${search}.*`;
    sortBy = sortBy ? `$${sortBy}` : "$title";

    let statusQuery = {};
    if (status) {
      statusQuery = { status: status };
    }
    let taskList = await Todo.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      { $match: statusQuery },
      {
        $match: {
          $or: [
            {
              title: {
                $regex: search,
                $options: "i",
              },
            },
            {
              description: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $facet: {
          paginationData: [{ $count: "total" }],
          taskList: [
            { $sort: { insensitive: sortOrder } },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
      {
        $project: {
          taskList: 1,
          totalCount: {
            $cond: [
              { $eq: ["$paginationData", []] },
              0,
              { $arrayElemAt: ["$paginationData.total", 0] },
            ],
          },
        },
      },
    ]);
    return taskList;
  } catch (error) {
    throw new Error("Cannot update Task");
  }
};
