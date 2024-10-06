const express = require('express')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const app = express()

// Set EJS as templating engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack)
    return
  }
  console.log('Connected to database.')
})

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients'
  connection.query(query, (error, results) => {
    if (error) throw error
    res.render('data', { title: 'All Patients', data: results })
  })
})

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers'
  connection.query(query, (error, results) => {
    if (error) throw error
    res.render('data', { title: 'All Providers', data: results })
  })
})

// Question 3: Filter patients by First Name
app.get('/patients/byname/:firstName', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?'
  connection.query(query, [req.params.firstName], (error, results) => {
    if (error) throw error
    res.render('data', { title: `Patients named ${req.params.firstName}`, data: results })
  })
})

// Question 4: Retrieve all providers by their specialty
app.get('/providers/byspecialty/:specialty', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?'
  connection.query(query, [req.params.specialty], (error, results) => {
    if (error) throw error
    res.render('data', { title: `Providers with specialty: ${req.params.specialty}`, data: results })
  })
})

// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`)
})