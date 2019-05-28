// implement your API here

const express = require("express");

// Import in my DB File
const db = require("./data/db");

const server = express();
server.use(express.json());

// S E R V E R - R E S P O N S E
server.get("/", (req, res) => {
  res.send(`
  <h1>Hello World (:</h1>
    <p>Welcome to Web Api Challenege I</p>    
    `);
});

// P O S T /api/users

server.post("/api/users", (req, res) => {
  const dbInfo = req.body;
  db.insert(dbInfo)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(400).json({
        errorMessage: "Please provide name and bio for the user."
      });
    });
});

// G E T /api/users
server.get("/api/users", (req, res) => {
  db.find()
    .then(db => {
      res.status(200).json(db);
    })
    .catch(err => {
      error: "The users information could not be retrieved.";
    });
});

// G E T /api/users/:id
server.get("/api/users/:id", (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      res.status(404).json({
        message: "The user with the specified ID does not exist."
      });
    })
    .catch(err => {
      res.status(500).json({
        error: "The user information could not be retrieved."
      });
    });
});

// D E L E T E /api/users/:id
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).json(deleted);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The user could not be removed"
      });
    });
});

// P U T /api/users/:id
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The user information could not be modified."
      });
    });
});

server.listen(5000, () => {
  console.log("\n*** Server Running on http://localhost:5000 ***\n");
});
function newFunction(updateId, changes, res) {
  if (!updateId.name || !changes.bio) {
    res.status(400).json("Must Provide Name and Bio");
  }
}
