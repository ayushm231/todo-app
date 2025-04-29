import { useState, useEffect } from "react"
import axios from "../services/api"

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const TodoModal = ({ onClose }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [users, setUsers] = useState([])
  const [createdBy, setCreatedBy] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get(`${VITE_API_BASE_URL}/users`) // Fetch users from API
      setUsers(data) // Store users in state
      setCreatedBy(data[0]?._id || "") // Set first user as default creator
    }
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)

    const validUsernames = users.map((user) => user.username)

    // Find all @mentions
    const mentions = tagList.filter((tag) => tag.startsWith("@"))

    // Validate @mentions
    const invalidMentions = mentions.filter(
      (tag) => !validUsernames.includes(tag.slice(1))
    )

    if (invalidMentions.length > 0) {
      alert(`These tagged users do not exist: ${invalidMentions.join(", ")}`)
      return // 🚫 Block saving todo
    }

    // Map valid mentions to user IDs
    const mentionedUserIds = users
      .filter((user) => mentions.map((m) => m.slice(1)).includes(user.username))
      .map((user) => user._id)

    try {
      await axios.post(`${VITE_API_BASE_URL}/todos`, {
        title,
        description,
        tags: tagList, // Save all tags
        priority,
        createdBy,
        mentionedUsers: mentionedUserIds, // Save mentioned users
      })

      onClose()
    } catch (error) {
      console.error("Error creating todo", error)
      alert("Failed to create todo")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Create Todo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded p-2"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border rounded p-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full border rounded p-2"
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <select
            className="w-full border rounded p-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            type="submit"
          >
            Save
          </button>
          <button
            className="w-full text-gray-500 mt-2"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default TodoModal
