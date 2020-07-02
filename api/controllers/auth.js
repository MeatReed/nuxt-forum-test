import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import Blob from 'node-blob'
import bcrypt from 'bcrypt'
import atob from 'atob'

import avatarDefault from '../../static/avatarDefault.js'
const router = Router()

router.post('/register', async function (req, res, next) {
  if (req.body) {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    if (email && password && username) {
      const dbUserName = await req.mysql.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      )
      if (!dbUserName[0][0]) {
        const dbEmail = await req.mysql.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        )
        if (!dbEmail[0][0]) {
          bcrypt.hash(password, 10, async function (err, encryptPassword) {
            if (err)
              return res.status(400).json({
                error: 'Une erreur est survenue',
              })
            const newUser = {
              token: uuidv4(),
              role: 1,
              email,
              username,
              show_email: 0,
              password_encrypt: encryptPassword,
              avatar: dataURIToBlob(avatarDefault.base64).buffer,
              avatar_type: dataURIToBlob(avatarDefault.base64).type,
              created_at: new Date(),
            }
            const tokenJwt = jwt.sign(
              {
                token: newUser.token,
                role: newUser.role,
                email: newUser.email,
                username: newUser.username,
                show_email: newUser.show_email,
                password_encrypt: newUser.password_encrypt,
                created_at: newUser.created_at,
              },
              process.env.SECRET
            )
            const newUserDb = await req.mysql.query('INSERT INTO users SET ?', {
              token: newUser.token,
              role: newUser.role,
              email: newUser.email,
              username: newUser.username,
              show_email: newUser.show_email,
              password_encrypt: newUser.password_encrypt,
              avatar: newUser.avatar,
              avatar_type: newUser.avatar_type,
              created_at: newUser.created_at,
            })
            const token = {
              tokenSession: tokenJwt,
              tokenAccount: newUser.token,
            }
            req.session.user = {
              token,
              id: newUserDb[0].insertId,
              role: newUser.role,
              email: newUser.email,
              username: newUser.username,
              show_email: newUser.show_email,
              created_at: newUser.created_at,
            }
            return res.json({
              token,
              id: newUserDb[0].insertId,
              role: newUser.role,
              email: newUser.email,
              username: newUser.username,
              show_email: newUser.show_email,
              created_at: newUser.created_at,
            })
          })
        } else {
          return res.status(400).json({
            error: 'Email déjà existant.',
          })
        }
      } else {
        return res.status(400).json({
          error: "Nom d'utilisateur déjà existant.",
        })
      }
    } else {
      return res.status(400).json({
        error: 'Une valeur est manquante.',
      })
    }
  } else {
    return res.status(400).json({
      error: "Aucune valeur n'a été entrée.",
    })
  }
})

router.post('/login', async (req, res) => {
  if (req.body.token) {
    const account = await req.mysql.query(
      'SELECT token,id,role,email,show_email,username,password_encrypt,description,created_at,edited_at FROM users WHERE token = ?',
      [req.body.token]
    )
    if (account[0][0]) {
      const user = {
        token: account[0][0].token,
        id: account[0][0].id,
        role: account[0][0].role,
        email: account[0][0].email,
        username: account[0][0].username,
        show_email: account[0][0].show_email,
        password_encrypt: account[0][0].password_encrypt,
        description: account[0][0].description,
        created_at: account[0][0].created_at,
        edited_at: account[0][0].edited_at,
      }
      const tokenJwt = jwt.sign(user, process.env.SECRET)
      const token = {
        tokenSession: tokenJwt,
        tokenAccount: user.token,
      }
      req.session.user = {
        token,
        id: user.id,
        role: user.role,
        email: user.email,
        show_email: user.show_email,
        username: user.username,
        description: user.description,
        created_at: user.created_at,
        edited_at: user.edited_at,
      }
      return res.json({
        token,
        id: user.id,
        role: user.role,
        email: user.email,
        show_email: user.show_email,
        username: user.username,
        description: user.description,
        created_at: user.created_at,
        edited_at: user.edited_at,
      })
    } else {
      return res.status(400).json({
        error: 'Compte introuvable',
      })
    }
  } else {
    const email = req.body.email
    const password = req.body.password
    if (email && password) {
      const account = await req.mysql.query(
        'SELECT token,id,role,email,show_email,username,password_encrypt,description,created_at,edited_at FROM users WHERE email = ?',
        [email]
      )
      if (account[0][0]) {
        const user = {
          token: account[0][0].token,
          id: account[0][0].id,
          role: account[0][0].role,
          email: account[0][0].email,
          username: account[0][0].username,
          show_email: account[0][0].show_email,
          password_encrypt: account[0][0].password_encrypt,
          description: account[0][0].description,
          created_at: account[0][0].created_at,
          edited_at: account[0][0].edited_at,
        }
        bcrypt.compare(password, user.password_encrypt, function (err, result) {
          if (err)
            return res.status(400).json({
              error: 'Une erreur est survenue !',
            })
          if (result === true) {
            const tokenJwt = jwt.sign(user, process.env.SECRET)
            const token = {
              tokenSession: tokenJwt,
              tokenAccount: user.token,
            }
            req.session.user = {
              token,
              id: user.id,
              role: user.role,
              email: user.email,
              show_email: user.show_email,
              username: user.username,
              description: user.description,
              created_at: user.created_at,
              edited_at: user.edited_at,
            }
            return res.json({
              token,
              id: user.id,
              role: user.role,
              email: user.email,
              show_email: user.show_email,
              username: user.username,
              description: user.description,
              created_at: user.created_at,
              edited_at: user.edited_at,
            })
          } else {
            return res.status(400).json({
              error: 'Mauvais mot de passe !',
            })
          }
        })
      } else {
        return res.status(400).json({
          error: 'Compte introuvable',
        })
      }
    } else {
      return res.status(400).json({
        error: 'Une valeur est manquante.',
      })
    }
  }
})

router.post('/logout', (req, res) => {
  req.session.user = null
  return res.json()
})

function dataURIToBlob(dataURI, sliceSize = 512) {
  dataURI = dataURI.replace(/^data:/, '')

  const type = dataURI.match(/image\/[^;]+/)
  const base64 = dataURI.replace(/^[^,]+,/, '')
  const byteCharacters = atob(base64)
  const byteArrays = []
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)
    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }
  return new Blob(byteArrays, { type })
}

module.exports = router
