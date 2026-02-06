const express = require("express");
const todosService = require("../services/todosService");

const router = express.Router();

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

// GET /todos
router.get("/", async (req, res) => {
  try {
    const todos = await todosService.getAll();
    res.status(200).json(todos);
  } catch (error) {
    handleError(res, error);
  }
});

// GET /todos/:id
router.get("/:id", async (req, res) => {
  try {
    const todo = await todosService.getById(Number(req.params.id));
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    handleError(res, error);
  }
});

// POST /todos
router.post("/", async (req, res) => {
  try {
    const todo = await todosService.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    handleError(res, error);
  }
});

// PUT /todos/:id
router.put("/:id", async (req, res) => {
  try {
    const todo = await todosService.update(Number(req.params.id), req.body);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /todos/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await todosService.remove(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Todo not found" });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;

