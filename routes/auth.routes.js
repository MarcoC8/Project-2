const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController
} = require('../controllers/auth.controllers');

const {isLoggedIn, isAnon} = require('../middleware/auth.middlewares');

const router = require('express').Router();

router.get('/signup', signupGetController);

router.post('/signup', isAnon, signupPostController);

router.get('/login', isAnon, loginGetController);

router.post('/login', loginPostController);

router.get('/logout', (req, res, next) => {
    req.session.destroy(()=> {
        res.redirect('/');
    })
})

module.exports = router;