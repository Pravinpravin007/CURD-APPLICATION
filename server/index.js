const express = require("express");
const cors = require("cors");
let users = require("./sample.json");

const app = express();
app.use(express.json());
const port = 8000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Add new user
app.post("/users", async (req, res) => {
  try {
    const { name, age, city } = req.body;
    if (!name || !age || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = { id: Date.now(), name, age, city };
    users.push(newUser);

    return res.json({ message: "User added successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user
app.put("/users/update/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, age, city } = req.body;

  users = users.map(user =>
    user.id === userId ? { ...user, name, age, city } : user
  );

  res.json({ message: "User updated successfully", users });
});

// Delete user
app.delete("/users/delete/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter((user) => user.id !== userId);
  res.json(users);
});

// Start server
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
