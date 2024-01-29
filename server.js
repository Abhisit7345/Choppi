import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

app.post("/users", (req, res) => {
  const id = req.body.id
  const email = req.body.email;
  const name = req.body.name;

  console.log(id,email,name)
  console.log('testtttttttttttttttttttt')

  const sql = "INSERT INTO users (id,email,name) VALUES (?,?,?)";

  db.query(sql, [id,email, name], (err, result) => {
    if (err) return res.json({ error: err.message });

    const insertUserId = result.insertId;
    return res.json({
      message: "User added successfully",
      userId: insertUserId,
    });
  });
});

app.get("/profilePicture", (req, res) => {
  const userId = req.query.id;

  const sql = "SELECT url FROM profilePicture WHERE id = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.json({ error: err.message });

    if (result.length === 0) {
      return res.json({
        message: "Profile picture not found for the specified user ID",
      });
    }

    const pictureURL = result[0].url;
    return res.json({ pictureURL });
  });
});

app.get("/", (req, res) => {
  return res.json("From Backend Side");
});

app.get("/users", (req, res) => {
  const userId = req.query.id

  const sql = "SELECT * FROM users WHERE id = ?";

  db.query(sql, [userId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.put("/profilePicture/:id", (req, res) => {
  const id = req.params.id;
  const newUrl = req.body.newUrl;

  // Update the URL in the 'profilePicture' table based on the ID
  const sql = "UPDATE profilePicture SET url = ? WHERE id = ?";

  db.query(sql, [newUrl, id], (err, result) => {
    if (err) return res.json({ error: err.message });

    // Check if the update was successful
    if (result.affectedRows === 0) {
      return res.json({ message: "No records updated. ID not found." });
    }

    return res.json({ message: "URL updated successfully" });
  });
});

app.post("/profilePicture", (req, res) => {
  const id = req.body.id

  const sql = "INSERT INTO profilePicture (id) VALUES (?)";

  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ error: err.message });

    const insertUserId = result.insertId;
    return res.json({
      message: "Profile created successfully",
    });
  });
});

//admin.initializeApp()
app.get("/firebaseUsers", (req, res) => {
  return listAllUsers()
});

app.listen(8081, () => {
  console.log("listening");
});
