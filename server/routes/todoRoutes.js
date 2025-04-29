import express from "express"
import UserAuth from "../middlewares/userAuth.js"
import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js"

const router = express.Router()

router.route("/").post(UserAuth, createTodo).get(getTodos)
router
  .route("/:id")
  .get(getTodoById)
  .put(UserAuth, updateTodo)
  .delete(UserAuth, deleteTodo)

export default router
