import { useState, useEffect } from "react"
import axios from "./services/api"
import TodoCard from "./components/TodoCard"
import TodoModal from "./components/TodoModal"
import Pagination from "./components/Pagination"
import TodoDetailsModal from "./components/TodoDetailsModal"
import UserSwitcher from "./components/UserSwitcher"

const App = () => {
  const [todos, setTodos] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState(
    localStorage.getItem("userId") || ""
  )

  const fetchTodos = async (page = 1, userId = selectedUser) => {
    try {
      const query = userId ? `&createdBy=${userId}` : ""
      const { data } = await axios.get(`/todos?page=${page}&limit=3${query}`)
      setTodos(data.todos)
      setPages(data.pages)
    } catch (error) {
      console.error("Error fetching todos", error)
    }
  }

  useEffect(() => {
    fetchTodos(page, selectedUser)
  }, [page, selectedUser])

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
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            onClick={() => setOpenModal(true)}
          >
            Add Todo
          </button>
        </div>

        <div className="flex justify-start w-full">
          <UserSwitcher
            selectedUser={selectedUser}
            onUserChange={handleUserChange}
          />
        </div>

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
