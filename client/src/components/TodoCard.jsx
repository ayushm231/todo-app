import getPriorityColor from "../utils/helpers"

const TodoCard = ({ todo, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded shadow hover:shadow-md cursor-pointer"
    >
      <h2 className="text-xl font-semibold">{todo.title}</h2>
      <p className="text-gray-600">{todo.description}</p>

      <div className="flex gap-2 mt-2 flex-wrap">
        {todo.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-200 rounded-full px-2 py-1 text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
            todo.priority
          )}`}
        >
          {todo.priority}
        </span>
      </div>
    </div>
  )
}

export default TodoCard
