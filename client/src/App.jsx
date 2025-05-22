import { useCallback, useState, useEffect } from "react"
import axios from "./services/api"
import TodoCard from "./components/TodoCard"
import TodoModal from "./components/TodoModal"
import Pagination from "./components/Pagination"
import TodoDetailsModal from "./components/TodoDetailsModal"
import UserSwitcher from "./components/UserSwitcher"
import debounce from "lodash/debounce"
import CSVUpload from "./components/CSVUpload"
import { exportTodosToCSV } from "./utils/exportToCSV"

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const App = () => {
  const [todos, setTodos] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [selectedPriority, setSelectedPriority] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [rawTagInput, setRawTagInput] = useState("")
  const [tagFilter, setTagFilter] = useState("")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [selectedUser, setSelectedUser] = useState(
    localStorage.getItem("userId") || ""
  )

  // Adding debouncing using useCallback
  const debouncedSetTagFilter = useCallback(
    debounce((value) => {
      setTagFilter(value)
    }, 500),
    []
  )

  const fetchTodos = async (page = 1, userId = selectedUser) => {
    try {
      // const query = userId ? `&createdBy=${userId}` : ""
      let query = `?page=${page}&limit=3`

      if (userId) query += `&createdBy=${userId}`
      if (selectedPriority) query += `&priority=${selectedPriority}`
      if (tagFilter) query += `&tags=${encodeURIComponent(tagFilter)}`
      if (sortOrder) query += `&sortBy=title:${sortOrder}`
      const { data } = await axios.get(`${VITE_API_BASE_URL}/todos${query}`)
      setTodos(data.todos)
      setPages(data.pages)
    } catch (error) {
      console.error("Error fetching todos", error)
    }
  }

  useEffect(() => {
    fetchTodos(page, selectedUser)
  }, [page, selectedUser, selectedPriority, tagFilter, sortOrder])

  const handleUserChange = (userId) => {
    setSelectedUser(userId)
    localStorage.setItem("userId", userId) // Save selected user in localStorage
    window.location.reload() // Reload to reset headers and app state
  }

  return (
    <div className="flex justify-center items-center min-h-[100vh] bg-gray-200 overflow-hidden">
      <div className="w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Todo List</h1>
          <div className="flex gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => setOpenModal(true)}
            >
              Add Todo
            </button>
            <button
              onClick={() => exportTodosToCSV(todos)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              Export Todos to CSV
            </button>
          </div>
        </div>

        <CSVUpload onUploadComplete={() => fetchTodos(page, selectedUser)} />

        <div className="flex justify-start w-full">
          <UserSwitcher
            selectedUser={selectedUser}
            onUserChange={handleUserChange}
          />
        </div>

        <div className="flex gap-4 mb-4">
          <select
            className="border p-2 rounded"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Filter by tag"
            value={rawTagInput}
            onChange={(e) => {
              setRawTagInput(e.target.value)
              debouncedSetTagFilter(e.target.value)
            }}
          />
        </div>

        <select
          className="border p-2 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Title</option>
          <option value="asc">Title: A → Z</option>
          <option value="desc">Title: Z → A</option>
        </select>

        <div className="grid gap-4 mt-4">
          {todos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onClick={() => setSelectedTodo(todo)}
            />
          ))}
        </div>

        <Pagination page={page} pages={pages} setPage={setPage} />

        {openModal && (
          <TodoModal
            onClose={() => {
              setOpenModal(false)
              fetchTodos()
            }}
          />
        )}

        {selectedTodo && (
          <TodoDetailsModal
            todo={selectedTodo}
            onClose={() => setSelectedTodo(null)}
            refetchTodos={() => fetchTodos(page)}
          />
        )}
      </div>
    </div>
  )
}

export default App
