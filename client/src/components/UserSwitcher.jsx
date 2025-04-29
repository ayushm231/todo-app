import { useEffect, useState } from "react"
import axios from "../services/api"

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const UserSwitcher = ({ selectedUser, onUserChange }) => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(`${VITE_API_BASE_URL}/users`)
      setUsers(data)
    }
    fetch()
  }, [])

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Select User:</label>
      <select
        className="border p-2 rounded w-full"
        value={selectedUser}
        onChange={(e) => onUserChange(e.target.value)}
      >
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username}
          </option>
        ))}
      </select>
    </div>
  )
}

export default UserSwitcher
