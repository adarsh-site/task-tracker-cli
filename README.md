# Task Tracker

This is a simple command-line interface (CLI) application for managing tasks from your terminal.

Project Url - https://roadmap.sh/projects/task-tracker

## Features

 - Add, Update, and Delete tasks
 - Mark a task as in-progress or done
 - List all tasks
- List all tasks that are done
- List all tasks that are not done
- List all tasks that are in progress

## Installation

Clone the repository

```bash
git clone https://github.com/adarsh-site/task-tracker-cli.git
```

Navigate to the project Directory

```bash
cd task-tracker-cli
```

Make executable

```bash
chmod +x index.js
```

Link

```bash
npm link

# or

sudo npm link
```

## Usage

```bash
# Adding a new task
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)

# Updating and deleting tasks
task-cli update 1 "Buy groceries and cook dinner"
task-cli delete 1

# Marking a task as in progress or done
task-cli mark-in-progress 1
task-cli mark-done 1

# Listing all tasks
task-cli list

# Listing tasks by status
task-cli list done
task-cli list todo
task-cli list in-progress

# Help
task-cli help
```
