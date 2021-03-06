import express from 'express'
import mysql from 'mysql2/promise'
require('dotenv').config()

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

const router = express.Router()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  req.mysql = connection
  next()
})

const auth = require('./controllers/auth')
const users = require('./controllers/users')
const roles = require('./controllers/roles')

router.use(auth, users, roles)

export default {
  path: '/api',
  handler: router,
}
