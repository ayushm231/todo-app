import { useState } from "react"
import getPriorityColor from "../utils/helpers"
import axios from "../services/api"

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const TodoDetailsModal = ({ todo, onClose, refetchTodos }) => {
  if (!todo) return null

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description)
  const [editTags, setEditTags] = useState(todo.tags.join(", "))
  const [editPriority, setEditPriority] = useState(todo.priority)
  const [newNote, setNewNote] = useState("")

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this todo?")) return

    try {
      await axios.delete(`${VITE_API_BASE_URL}/todos/${todo._id}`)
      alert("Todo deleted successfully!")
      onClose() // Close the modal after delete
      if (refetchTodos) refetchTodos()
    } catch (error) {
      console.error("Error deleting todo", error)
      alert("Failed to delete todo.")
    }
  }

  const handleSave = async () => {
    const tagList = editTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)

    try {
      // Fetch all users
      const { data: allUsers } = await axios.get(`${VITE_API_BASE_URL}/users`)

      const validUsernames = allUsers.map((user) => user.username)

      const mentions = tagList.filter((tag) => tag.startsWith("@"))

      const invalidMentions = mentions.filter(
        (tag) => !validUsernames.includes(tag.slice(1))
      )

      if (invalidMentions.length > 0) {
        alert(`These tagged users do not exist: ${invalidMentions.join(", ")}`)
        return // 🚫 Block saving todo
      }

      // Map valid mentions to user IDs
      const mentionedUserIds = allUsers
        .filter((user) =>
          mentions.map((m) => m.slice(1)).includes(user.username)
        )
        .map((user) => user._id)

      // Send updated todo
      await axios.put(`${VITE_API_BASE_URL}/todos/${todo._id}`, {
        title: editTitle,
        description: editDescription,
        tags: tagList, // Save all tags
        priority: editPriority,
        mentionedUsers: mentionedUserIds, // Send valid mentioned users
      })

      alert("Todo updated successfully!")
      setIsEditing(false)
      onClose()
      if (refetchTodos) refetchTodos()
    } catch (error) {
      console.error("Error updating todo:", error)
      alert("Failed to update todo.")
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return alert("Note cannot be empty")

    try {
      await axios.put(`${VITE_API_BASE_URL}/todos/${todo._id}`, {
        notes: [...(todo.notes || []), { content: newNote }],
      })

      alert("Note added successfully!")
      setNewNote("")
      onClose()
      if (refetchTodos) refetchTodos()
    } catch (error) {
      console.error("Error adding note", error)
      alert("Failed to add note.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px] max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          x
        </button>

        {/* Title */}
        {isEditing ? (
          <input
            className="border w-full p-2 mb-2"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
        ) : (
          <h2 className="text-2xl font-bold mb-4">{todo.title}</h2>
        )}

        {/* Description */}
        {isEditing ? (
          <textarea
            className="border w-full p-2 mb-2"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        ) : (
          <p className="text-gray-700 mb-4">{todo.description}</p>
        )}

        {/* Tags */}
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Tags:</h4>
          {isEditing ? (
            <input
              className="border w-full p-2"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              placeholder="Comma separated"
            />
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {todo.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Priority */}
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Priority:</h4>
          {isEditing ? (
            <select
              className="border w-full p-2"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          ) : (
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getPriorityColor(
                todo.priority
              )}`}
            >
              {todo.priority}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Notes:</h4>
          {todo.notes?.length > 0 ? (
            todo.notes.map((note, index) => (
              <div key={index} className="border p-2 rounded mb-2">
                <p className="text-gray-600">{note.content}</p>
                <p className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No notes yet.</p>
          )}
        </div>
        <div className="mt-2">
          <textarea
            className="border w-full p-2"
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button
            onClick={handleAddNote}
            className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Add Note
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-6">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
            >
              Edit
            </button>
          )}

          <button
            onClick={handleDelete}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoDetailsModal
