const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'root'
});


app.get("/", (req, res) => {
    let q = "SELECT count(*) from user";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("error");
    }
});

app.get("/users", (req, res) => {
    let q = "SELECT * from user";
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            res.render("user.ejs", { users });
        });
    } catch (err) {
        console.log(err);
        res.send("error");
    }

});

app.get("/users/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = "Select * from user where id = ?";
    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("error");
    }

});

app.patch("/users/:id", (req, res) => {
    let { id } = req.params
    newname = req.body.username;
    pwd = req.body.password;
    let q = "Select * from user where id = ?";
    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (pwd != user.password) {
                res.send("wrong password");
            } else {
                let q2 = `update user set username='${newname}' where id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/users");
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("error");
    }
});

app.get("/users/new", (req, res) => {
    res.render("new.ejs");
})

app.post("/user/new", (req, res) => {
    let id = uuidv4();
    let { username, email, password } = req.body;
    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
    try {
        connection.query(q, (err, result) => {


            res.redirect("/users");
        });
    } catch (err) {
        res.send("some error occurred");
    }
});

app.get("/users/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = "Select * from user where id = ?";
    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("delete.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("error");
    }

});

app.delete("/users/:id/", (req, res) => {
    let { id } = req.params;
    let pwd = req.body.password;
    let q = "Select * from user where id = ?";
    try {
        connection.query(q, [id], (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (pwd != user.password) {
                res.send("wrong password");
            } else {
                let q2 = `delete from user where id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/users");
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("error");
    }

});

app.listen("3000", () => {
    console.log("server is listening on port 3000");
});


