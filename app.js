const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.json)

const db = mysql.createConnection({
    host : 'localhost',
    user : 'nick',
    password : 'root',
    database : 'employee',
    multipleStatements : true,
});

//connect to mysql
db.connect((err) => {
    if(err){
        console.log('DB connectoin failed\nError : '+ JSON.stringify(err));
    }
    console.log('MySQL connected');
});


app.listen('3000', () => {
    console.log('Server started on port 3000');
});


//create db
app.get('/createdb',(req,res) => {
    let sql = 'CREATE DATABASE employee';
    db.query(sql, (err, result) => {
        if(err){
            console.log('DB creation failed\nError : '+ JSON.stringify(err));
        }
        console.log(result);
        res.send('Database created')
    });
});


//create table posts
app.get('/createtable',(req, res) => {
    let sql = 'create table employee(EmpId int AUTO_INCREMENT, EmpName VARCHAR(45), EmpCode VARCHAR(20), Primary Key (EmpId))';
    db.query(sql, (err, result) => {
        if(err){
            console.log('Table creation failed\nError : '+ JSON.stringify(err));
        }v
        console.log(result);
        res.send('POST Table created')
    });
});

//get all employees
app.get('/employees',(req, res) => {
    let sql = 'SELECT * FROM employee';
    db.query(sql, (err, rows, fields) => {
        if(!err)
            res.send(rows);
        else
            console.log(err);
    });
});

//select single post
app.get('/employees/:id',(req, res) => {
    let sql = `SELECT * FROM employee WHERE EmpId = ${req.params.id}`;
    db.query(sql, (err, rows, fields) => {
        if(!err)
            res.send(rows);
        else
            console.log(err);
    });
});

//delete employee
app.delete('/employee/:id',(req, res) => {
    let sql = `DELETE FROM employee WHERE EmpId = ${req.params.id}`;
    db.query(sql, (err, rows, fields) => {
        if(!err)
            res.send('Deleted successfully');
        else
            console.log(err);
    });
});

//insert into employee
app.post('/employees',(req, res) => {
    let emp = req.body;
    let sql = 'SET @EmpName = ?;SET @EmpCode = ?; \
    CALL employeeAddOrEdit(@EmpName,@EmpCode);';
    db.query(sql, [emp.EmpName, emp.EmpCode], (err, result) => {
        if(!err)
            res.send('Added successfully');
        else
            console.log(err);
    });
});

//update employee
app.put('/employees',(req, res) => {
    let emp = req.body;
    let sql = 'SET @EmpId= ?;SET @EmpName = ?;SET @EmpCode = ?; \
    CALL employeeAddOrEdit(@EmpId,@EmpName,@EmpCode);';
    db.query(sql, [emp.EmpId, emp.EmpName, emp.EmpCode], (err, result) => {
        if(!err)
            res.send('Updated successfully');
        else
            console.log(err);
    });
});

