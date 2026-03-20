import { useEffect, useState } from "react";
import { getUser, deleteUser, updateUser } from "./redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";

interface Todo {
  title: string;
  description: string;
  priority: string;
  category: string;
  dueDate: string;
  reminder: boolean;
  tag: string;
}

const UserToDo = () => {
  const dispatch = useDispatch();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    category: "work",
    dueDate: "",
    reminder: false,
    tag: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
    tag: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      dueDate: "",
      tag: "",
    };

    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
      isValid = false;
    }

    if (!formData.tag.trim()) {
      newErrors.tag = "Tag is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // const usersInfo = useSelector((state: any) => state.usersInfo.users);
  const usersInfo = useSelector(
  (state: { usersInfo: { users: Todo[] } }) => state.usersInfo.users
);

  const totalPages = Math.ceil(usersInfo.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTodos = usersInfo.slice(startIndex, endIndex);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (
      !formData.title ||
      !formData.description ||
      !formData.dueDate ||
      !formData.tag
    ) {
      return alert("no data avail to add");
    }

    dispatch(getUser(formData));

    setFormData({
      title: "",
      description: "",
      priority: "low",
      category: "work",
      dueDate: "",
      reminder: false,
      tag: "",
    });
  };
  const handleEdit = (index: number) => {
    setFormData(usersInfo[index]);
    setEditIndex(index);
  };
  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(
      updateUser({
        index: editIndex,
        data: formData,
      }),
    );

    setEditIndex(null);

    setFormData({
      title: "",
      description: "",
      priority: "low",
      category: "work",
      dueDate: "",
      reminder: false,
      tag: "",
    });
  };

  const handleDelete = (index: number) => {
    const todo = usersInfo[index];

    const confirmDelete = window.confirm(`Delete "${todo.title}" ?`);

    if (!confirmDelete) return;

    dispatch(deleteUser(index));
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [usersInfo, totalPages]);

  return (
    <>
      <h2 style={{ width: "100%", marginLeft: "45%" }}>ToDo App</h2>
      <form action="" className="form">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </label>
        <label>
          Priority:
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="health">Health</option>
          </select>
        </label>
        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && <p className="error">{errors.dueDate}</p>}
        </label>
        <label className="switch-label">
          <span>Reminder</span>

          <label className="switch">
            <input
              type="checkbox"
              name="reminder"
              checked={formData.reminder}
              onChange={handleChange}
            />
            <span className="slider"></span>
          </label>
        </label>
        <label>
          Tag:
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
          />
          {errors.tag && <p className="error">{errors.tag}</p>}
        </label>

        <button
          type="button"
          onClick={editIndex !== null ? handleUpdate : handleAdd}
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </form>

      <div className="table-container">
        <table className="todo-table header-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Category</th>
              <th>Due Date</th>
              <th>Reminder</th>
              <th>Tag</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
        </table>

        <div className="table-body-scroll">
          <table className="todo-table body-table">
            <tbody>
              {currentTodos.length > 0 ? (
                currentTodos.map((todo: Todo, index: number) => {
                  const realIndex = startIndex + index;

                  return (
                    <tr key={realIndex}>
                      <td>{todo.title || "NA"}</td>
                      <td>{todo.description || "NA"}</td>
                      <td>
                        <span className={`badge ${todo.priority}`}>
                          {todo.priority}
                        </span>
                      </td>
                      <td>{todo.category}</td>
                      <td>{todo.dueDate}</td>
                      <td>{todo.reminder ? "ON" : "OFF"}</td>
                      <td>{todo.tag}</td>

                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(realIndex)}
                        >
                          Edit
                        </button>
                      </td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(realIndex)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8}>No User detail available</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserToDo;
