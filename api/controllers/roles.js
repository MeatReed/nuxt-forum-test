import { Router } from 'express'

const router = Router()

router.post('/userRole', async (req, res) => {
  const id = req.body.id
  const roleID = req.body.roleID
  if (id && roleID) {
    const dbRole = await req.mysql.query(
      'SELECT * FROM roles WHERE id = ?',
      roleID
    )
    if (dbRole[0][0]) {
      return res.json(dbRole[0][0])
    } else {
      return res.status(400).json({
        error: 'Role introuvable !',
      })
    }
  } else {
    return res.status(400).json({
      error: 'Une valeur est manquante.',
    })
  }
})

module.exports = router
