import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Blob from 'node-blob'
import atob from 'atob'

const router = Router()

router.post('/user', async (req, res) => {
  const id = req.body.id
  if (id) {
    const dbUser = await req.mysql.query(
      'SELECT id,role,email,show_email,username,description,created_at,edited_at FROM users WHERE id = ?',
      [id]
    )
    if (dbUser[0][0]) {
      return res.json({
        id: dbUser[0][0].id,
        role: dbUser[0][0].role,
        email: dbUser[0][0].show_email === 0 ? null : dbUser[0][0].email,
        username: dbUser[0][0].username,
        description: dbUser[0][0].description,
        created_at: dbUser[0][0].created_at,
        edited_at: dbUser[0][0].edited_at,
      })
    } else {
      return res.status(400).json({
        error: 'Utilisateur introuvable !',
      })
    }
  } else {
    return res.status(400).json({
      error: 'Une valeur est manquante.',
    })
  }
})

router.post('/user/edit', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      return res.status(400)
    } else if (req.body) {
      const user = req.body.user
      const description = req.body.description
      const showEmail = req.body.showEmail
      const avatar = req.body.avatar
      let blobImage = null
      if (avatar) {
        blobImage = dataURIToBlob(req.body.avatar)
      }
      if (user && decoded) {
        const userChange = await req.mysql.query(
          'SELECT * FROM users WHERE id = ?',
          [user.id]
        )
        if (userChange[0][0]) {
          if (userChange[0][0].id === decoded.id) {
            const updateValues = {
              avatar: blobImage ? blobImage.buffer : userChange[0][0].avatar,
              avatar_type: blobImage
                ? blobImage.type
                : userChange[0][0].avatar_type,
              description,
              show_email: showEmail,
              edited_at: new Date(),
            }
            await req.mysql.query('UPDATE users SET ? WHERE id = ?', [
              updateValues,
              user.id,
            ])
            return res.json(updateValues)
          } else if (decoded.role > userChange[0][0].role) {
            const updateValues = {
              avatar: blobImage ? blobImage.buffer : userChange[0][0].avatar,
              avatar_type: blobImage ? blobImage.type : userChange[0][0].avatar,
              description,
              show_email: showEmail,
            }
            await req.mysql.query('UPDATE users SET ? WHERE id = ?', [
              updateValues,
              user.id,
            ])
            return res.json(updateValues)
          } else {
            return res.status(400).json({
              error: 'Une erreur est survenue !',
            })
          }
        } else {
          return res.status(400).json({
            error: 'Une erreur est survenue !',
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
})

router.get('/getAvatarUser/:id', async (req, res) => {
  const avatar = await getAvatarUser(req.params.id, req.mysql)
  if (avatar) {
    const img = Buffer.from(avatar.avatar, 'base64')
    res.set({ 'Content-Type': avatar.avatar_type })
    res.end(img)
  } else {
    return res.status(400).json({
      error: 'Image introuvable',
    })
  }
})

async function getAvatarUser(userId, mysql) {
  const dbAvatar = await mysql.query(
    'SELECT avatar,avatar_type FROM users WHERE id = ?',
    [userId]
  )
  return dbAvatar[0][0]
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization
  if (typeof bearerHeader !== 'undefined') {
    req.token = bearerHeader
    next()
  } else {
    return res.status(400).json({
      error: 'Accès refusé !',
    })
  }
}

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
