const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyparser.json());

app.get('/' ,(req, res) => res.send('Hello World!'));

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'employee',
    multipleStatements : true,
});

//connect to mysql
db.connect((err) => {
    if(err){
        console.log('DB connectoin failed\nError : '+ JSON.stringify(err));
    }
    else
        console.log('MySQL connected');
});

// test to check if connected
db.query('SELECT * FROM employee', (error, results, fields) => {
    if (error) throw error;
    console.log('The solution is: ', results);
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
        }
        else{
            console.log(result);
            res.send('POST Table created')
        }    
    });
});

//get all employees
app.get('/employees',(req, res) => {
    let sql = "SELECT * FROM employee";
    db.query(sql, (err, results) => {
        if(!err){
            res.send(results);
            console.log(results)
        }    
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
app.delete('/employees/:id',(req, res) => {
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
    let value =[emp.id, emp.name, emp.code];
    let sql = `INSERT INTO employee (EmpId, EmpName, EmpCode) VALUES (?)`;
    db.query(sql, [value], (err, result) => {
        if(!err){
            res.send('Added successfully');
            console.log(result)
        }    
        else
            console.log(err);
    });
});

//update employee
app.put('/employees',(req, res) => {
    let emp = req.body;
    let value =[emp.id, emp.name, emp.code];
    let sql = `UPDATE employee SET EmpName = ? WHERE EmpId = ?`;
    db.query(sql, [ emp.name, emp.id], (err, result) => {
        if(!err){
            res.send('Updated successfully');
            console.log(result);
        }    
        else
            console.log(err);
    });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

