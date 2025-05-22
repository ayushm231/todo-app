import Todo from "../models/ToDo.js"

export const createTodo = async (req, res) => {
  try {
    const todo = new Todo({
      ...req.body,
      createdBy: req.userId,
    })
    const savedTodo = await todo.save()
    res.status(201).json(savedTodo)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// GET todos implemented with pagination.
export const getTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1 // Default page 1
    const limit = parseInt(req.query.limit) || 10 // Default 10 todos per page

    const skip = (page - 1) * limit

    const { priority, tags, createdBy, sortBy } = req.query
    const filter = {}

    if (priority) filter.priority = priority
    if (createdBy) filter.createdBy = createdBy
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim())
      filter.tags = { $in: tagArray }
    }

    let sort = { createdAt: -1 }
    if (sortBy) {
      const [field, order] = sortBy.split(":")
      sort = { [field]: order === "asc" ? 1 : -1 }
    }

    const todos = await Todo.find(filter)
      .populate("mentionedUsers")
      .populate("createdBy")
      .sort(sort) // Newest first
      .skip(skip)
      .limit(limit)

    const total = await Todo.countDocuments(filter)

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      todos,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate("mentionedUsers")
      .populate("createdBy")
    res.json(todo)
  } catch (error) {
    res.status(404).json({ message: "Todo not found" })
  }
}

export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" })
    }

    // Check if the logged-in user is the creator
    if (todo.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this todo" })
    }

    // Perform update
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    res.json(updatedTodo)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" })
    }

    // Check if the logged-in user is the creator
    if (todo.createdBy.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this todo" })
    }

    await Todo.findByIdAndDelete(req.params.id)
    res.json({ message: "Todo removed" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
