import Papa from "papaparse"

export const exportTodosToCSV = (todos) => {
  const data = todos.map((todo) => ({
    title: todo.title,
    description: todo.description,
    tags: todo.tags?.join(", "),
    priority: todo.priority,
    createdBy: todo.createdBy?.username || "",
    createdAt: new Date(todo.createdAt).toLocaleString(),
  }))

  const csv = Papa.unparse(data)

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.setAttribute("href", url)
  link.setAttribute("download", "todos_export.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
