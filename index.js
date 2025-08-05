#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const tasksFilePath = path.join(__dirname, "tasks.json");

// Color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

// Functions to read taks from the JSON file
function readTasks() {
  if (fs.existsSync(tasksFilePath)) {
    const data = fs.readFileSync(tasksFilePath, "utf8");
    return JSON.parse(data);
  }
  return [];
}

// Function to write tasks to the JSON file
function writeTasks(tasks) {
  tasks.sort((a, b) => a.id - b.id);
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), "utf8");
}

// Function to get the next unique ID and use deleted ID too if available
function getNextId(tasks) {
  const ids = tasks.map((task) => task.id);
  ids.sort((a, b) => a - b);
  let nextId = 1;
  for (const id of ids) {
    if (id !== nextId) break;
    nextId++;
  }
  return nextId;
}

// Function to add a new task
function addTask(description) {
  const tasks = readTasks();
  const newTask = {
    id: getNextId(tasks),
    description: description,
    status: "todo",
    createdAt: new Date(),
    updatedAt: null,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  console.log(
    `${colors.green}Task added successfully! (ID: ${newTask.id})${colors.reset}`
  );
}

// Function to update a task
function updateTask(id, newDescription) {
  const tasks = readTasks();
  const task = tasks.find((task) => task.id === parseInt(id));

  if (!task) {
    console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    return;
  }

  task.description = newDescription;
  task.updatedAt = new Date();
  writeTasks(tasks);
  console.log(
    `${colors.green}Task ID ${id} updated successfully!${colors.reset}`
  );
}

// Function to delete a task
function deleteTask(id) {
  const tasks = readTasks();
  const newTasks = tasks.filter((task) => task.id !== parseInt(id));

  if (newTasks.length === tasks.length) {
    console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    return;
  }

  writeTasks(newTasks);
  console.log(
    `${colors.green}Task ID ${id} deleted successfully!${colors.reset}`
  );
}

// Function to mark a task as in-progress
function markInProgress(id) {
  const tasks = readTasks();
  const task = tasks.find((task) => task.id === parseInt(id));

  if (!task) {
    console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    return;
  }

  task.status = "in-progress";
  task.updatedAt = new Date();
  writeTasks(tasks);
  console.log(
    `${colors.yellow}Task ID ${id} marked as in-progress.${colors.reset}`
  );
}

// Function to mark a task as done
function markDone(id) {
  const tasks = readTasks();
  const task = tasks.find((task) => task.id === parseInt(id));

  if (!task) {
    console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    return;
  }

  task.status = "done";
  task.updatedAt = new Date();
  writeTasks(tasks);
  console.log(`${colors.green}Task ID ${id} marked as done.${colors.reset}`);
}

// Function to list tasks by status
function listTasks(status) {
  const tasks = readTasks();
  let filteredTasks = tasks;

  if (status) {
    if (status.toLowerCase() === "done") {
      filteredTasks = tasks.filter((task) => task.status === "done");
    } else if (status.toLowerCase() === "todo") {
      filteredTasks = tasks.filter((task) => task.status === "todo");
    } else if (status.toLowerCase() === "in-progress") {
      filteredTasks = tasks.filter((task) => task.status === "in-progress");
    } else {
      console.log(
        `${colors.red}Invalid status. Use 'done', 'todo', or 'in-progress'.${colors.reset}`
      );
      return;
    }
  }

  if (filteredTasks.length === 0) {
    console.log(`${colors.yellow}No tasks found.${colors.reset}`);
    return;
  }

  console.log(
    `${colors.cyan}Listing ${status ? status : "all"} tasks:${colors.reset}`
  );
  filteredTasks.forEach((task) => {
    console.log(
      `${task.id}. ${task.description} [${
        task.status === "done"
          ? colors.green + "Done"
          : task.status === "in-progress"
          ? colors.yellow + "In-progress"
          : colors.red + "To-do"
      }${colors.reset}]`
    );
  });
}

// Command-line interface logic
const args = process.argv.slice(2);
if (args[0] === "add") {
  const taskDescription = args.slice(1).join(" ");

  if (!taskDescription) {
    console.log(
      `${colors.red}Please provide a task description.${colors.reset}`
    );
  } else {
    addTask(taskDescription);
  }
} else if (args[0] === "update") {
  const id = args[1];
  const newDescription = args.slice(2).join(" ");
  if (!id || !newDescription) {
    console.log(
      `${colors.red}Please provide a task ID and new description.${colors.reset}`
    );
  } else {
    updateTask(id, newDescription);
  }
} else if (args[0] === "delete") {
  const id = args[1];

  if (!id) {
    console.log(`${colors.red}Please provide a task ID.${colors.reset}`);
  } else {
    deleteTask(id);
  }
} else if (args[0] === "mark-in-progress") {
  const id = args[1];

  if (!id) {
    console.log(`${colors.red}Please provide a task ID.${colors.reset}`);
  } else {
    markInProgress(id);
  }
} else if (args[0] === "mark-done") {
  const id = args[1];

  if (!id) {
    console.log(`${colors.red}Please provide a task ID.${colors.reset}`);
  } else {
    markDone(id);
  }
} else if (args[0] === "list") {
  const status = args[1]; // "done", "todo", "in-progress" (optional)
  listTasks(status);
} else {
  console.log(`${colors.cyan}Usage: task-cli <command> [arguments]${colors.reset}`);
  console.log(`${colors.cyan}Commands:${colors.reset}`);
  console.log(`${colors.yellow} add <task description>           - Add a new task${colors.reset}`);
  console.log(`${colors.yellow} update <id> <new description>    - Update a task by ID${colors.reset}`);
  console.log(`${colors.yellow} delete <id>                      - Delete a task by ID${colors.reset}`);
  console.log(`${colors.yellow} mark-in-progress <id>            - Mark a task as in-progress by ID${colors.reset}`);
  console.log(`${colors.yellow} mark-done <id>                   - Mark a task as done by ID${colors.reset}`);
  console.log(`${colors.yellow} list [status]                    - List tasks (status: done, todo, in-progress)${colors.reset}`);
}
