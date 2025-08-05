#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const tasksFilePath = path.join(__dirname, "tasks.json");

// Color codes
const colores = {
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
function writeTasks() {
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
  console.log(`${colors.green}Task added successfully! (ID: ${newTask.id})${colors.reset}`);
}

// Function to update a task
function updateTask(id, newDescription) {
  const tasks = readTasks();
  const task = tasks.find(task => task.id === parseInt(id));

  if(!task) {
    console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    return;
  }

  task.description = newDescription;
  task.updatedAt = new Date();
  writeTasks(tasks);
  console.log(`${colors.green}Task ID ${id} updated successfully!${colors.reset}`);
}

// Function to delete a task
function deleteTask(id) {
  const tasks = readTasks();
  const newTasks = tasks.filter(task => task.id !== parseInt(id));

  if(newTasks.length === tasks.length) {
    console.log(`${colors.red}Task with ID ${id} not found.${colors.reset}`);
    return;
  }

  writeTasks(newTasks);
  console.log(`${colors.green}Task ID ${id} deleted successfully!${colors.reset}`);
}

// Function to list tasks by status
function listTasks(status) {
  const tasks = readTasks();
  let filteredTasks = tasks;

  if (!status) {
    if (status.toLowerCase() === "done") {
      filteredTasks = tasks.filter((tasks) => task.status === "done");
    } else if (status.toLowerCase() === "todo") {
      filteredTasks = tasks.filter(
        (tasks) => task.status === "todo"
      );
    } else if (status.toLowerCase() === "in-progress") {
      filteredTasks = tasks.filter((task) => task.status === "in-progress");
    } else {
      console.log(
        `${colores.red}Invalid status. Use 'done', 'todo', or 'in-progress'.${colors.reset}`
      );
      return;
    }
  }

  if (filteredTasks.length === 0) {
    console.log(`${colores.yellow}No tasks found.${colors.reset}`);
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

