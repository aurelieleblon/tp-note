const todosService = require("../services/todosService");

const handleError = (res, error) => {
  if (
    error.message.includes("TITLE_INVALID") ||
    error.message.includes("COMPLETED_INVALID") ||
    error.message.includes("DUPLICATE_TITLE") ||
    error.message.includes("INVALID_ID")
  ) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: "Internal Server Error" });
};

exports.getAll = async (req, res) => {
  try {
    const todos = await todosService.getAll();
    res.status(200).json(todos);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getById = async (req, res) => {
  try {
    const todo = await todosService.getById(Number(req.params.id));
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    handleError(res, error);
  }
};

exports.create = async (req, res) => {
  try {
    const todo = await todosService.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    handleError(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const todo = await todosService.update(
      Number(req.params.id),
      req.body
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    handleError(res, error);
  }
};

exports.remove = async (req, res) => {
  try {
    const success = await todosService.remove(Number(req.params.id));
    if (!success) return res.status(404).json({ message: "Todo not found" });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

