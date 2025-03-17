import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUser, setFilterUser] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ id: null, name: "", age: "", city: "" });

  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterUser(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Search function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterUser(filteredUsers);
  };

  // Delete function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/users/delete/${id}`);
        getAllUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  // Close modal
  const closeModel = () => {
    setIsModelOpen(false);
    setIsEditing(false);
    setUserData({ id: null, name: "", age: "", city: "" });
  };

  // Open modal for new user
  const handleAddRecord = () => {
    setUserData({ id: null, name: "", age: "", city: "" });
    setIsEditing(false);
    setIsModelOpen(true);
  };

  // Handle form inputs
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle submit (Add or Update user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/users/update/${userData.id}`, userData);
      } else {
        await axios.post(`http://localhost:8000/users`, userData);
      }
      getAllUsers();
      closeModel();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Edit function
  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsEditing(true);
    setIsModelOpen(true);
  };

  return (
    <div className="container">
      <h3>CRUD application with React.js frontend and Node.js backend</h3>
      <div className="input-search">
        <input
          type="search"
          placeholder="Search text here"
          onChange={handleSearchChange}
        />
        <button className="btn green" onClick={handleAddRecord}>
          Add Record
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredUser.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td>
                <button className="btn green" onClick={() => handleUpdateRecord(user)}>
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)} className="btn red">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModelOpen && (
        <div className="model">
          <div className="model-content">
            <span className="close" onClick={closeModel}>
              &times;
            </span>
            <h2>{isEditing ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Full Name: </label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={handleData}
                  name="name"
                  id="name"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age: </label>
                <input
                  type="number"
                  value={userData.age}
                  onChange={handleData}
                  name="age"
                  id="age"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="city">City: </label>
                <input
                  type="text"
                  value={userData.city}
                  onChange={handleData}
                  name="city"
                  id="city"
                  required
                />
              </div>
              <button className="btn green" type="submit">
                {isEditing ? "Update User" : "Add User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
