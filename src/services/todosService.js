let todos = [];

exports.getAll = async () => {
  return todos;
};

exports.getById = async (id) => {
  if (isNaN(id)) {
    throw new Error("INVALID_ID");
  }
  return todos.find(t => t.id === id);
};

exports.create = async ({ title, completed }) => {
  if (!title || title.trim() === "") {
    throw new Error("TITLE_INVALID");
  }

  if (typeof completed !== "boolean") {
    throw new Error("COMPLETED_INVALID");
  }

  if (todos.some(t => t.title === title)) {
    throw new Error("DUPLICATE_TITLE");
  }

  const todo = {
    id: Date.now(),
    title,
    completed
  };

  todos.push(todo);
  return todo;
};

exports.update = async (id, { title, completed }) => {
  if (isNaN(id)) {
    throw new Error("INVALID_ID");
  }

  if (!title || title.trim() === "") {
    throw new Error("TITLE_INVALID");
  }

  if (typeof completed !== "boolean") {
    throw new Error("COMPLETED_INVALID");
  }

  if (todos.some(t => t.title === title && t.id !== id)) {
    throw new Error("DUPLICATE_TITLE");
  }

  const todo = todos.find(t => t.id === id);
  if (!todo) return null;

  todo.title = title;
  todo.completed = completed;
  return todo;
};

exports.remove = async (id) => {
  if (isNaN(id)) {
    throw new Error("INVALID_ID");
  }

  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return false;

  todos.splice(index, 1);
  return true;
};
