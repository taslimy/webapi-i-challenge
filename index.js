// implement your API here

const express = require("express");

// Import in my DB File
const db = require("./data/db");

const server = express();
server.use(express.json());

// C U S T O M  M I D D L E W A R E
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} ${req.get(
      "Origin"
    )}`
  );

  next();
}

function atGate(req, res, next) {
  console.log("At the gate, about to be eaten");

  next();
}

function auth(req, res, next) {
  if (req.url === "/mellon") {
    next();
  } else {
    res.send("you shall not pass");
  }
}

server.use(logger);
server.use(atGate);

server.get('/mellon', auth, (req,res) => {
  console.log('gate opening . . .');
  console.log('inside and safe');
  res.send('welcome traveler')
})

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
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      }
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
        res.status(200).json(deleted);
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

// C U S T O M  M I D D L E W A R E (!! must be at the bottom of page !!)

server.use(function(req, res) {
  res.status(404).send(`Ain't got time for that`);
});

/////////

server.listen(5000, () => {
  console.log("\n*** Server Running on http://localhost:5000 ***\n");
});
