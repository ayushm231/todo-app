import { useEffect, useState } from "react"
import Papa from "papaparse"
import axios from "../services/api"

const CSVUpload = ({ onUploadComplete }) => {
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/users")
        setUsers(data)
      } catch (err) {
        console.error("Failed to fetch users", err)
      }
    }
    fetchUsers()
  }, [])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError("")

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawTodos = results.data

        const processedTodos = rawTodos.map((row) => {
          const matchedUser = users.find(
            (u) =>
              u.username.trim().toLowerCase() ===
              row.createdBy?.trim().toLowerCase()
          )

          return {
            title: row.title,
            description: row.description,
            tags: row.tags?.split(",").map((t) => t.trim()) || [],
            priority: row.priority || "Medium",
            createdBy: matchedUser?._id,
          }
        })

        const validTodos = processedTodos.filter((todo) => todo.createdBy)

        if (validTodos.length === 0) {
          setError("No valid rows to upload")
          return
        }

        try {
          const response = await axios.post("/todos/bulk", {
            todos: validTodos,
          })
          const { message } = response.data

          alert(message)

          if (onUploadComplete) onUploadComplete()
        } catch (err) {
          console.error("Error uploading todos:", err)
          setError("Failed to upload todos.")
        }
      },
    })
  }

  return (
    <div className="mt-4">
      <label className="block font-semibold mb-1">Upload CSV:</label>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default CSVUpload
