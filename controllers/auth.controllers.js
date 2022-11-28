const bcryptsjs = require('bcryptjs');
const User = require('../models/User.model');
const axios = require('axios');

const signupGetController = (req, res, next) => {
    res.render('signup.hbs')
};

const signupPostController = (req, res, next) => {
    console.log(req.body)

    if(!req.body.email || ! req.body.password){
        res.send('Sorry you forgot an email or password')
        return;
    }


User.findOne ({email: req.body.email})
.then(foundUser => {

    if(foundUser){
        res.send('Sorry user already exists');
        return;
    }

    const myHashedPassword = bcryptsjs.hashSync(req.body.password)

    return User.create({
        email: req.body.email,
        password: myHashedPassword
    })

})
.then(createdUser => {
    console.log("here's the new user", createdUser);
    res.send(createdUser);
})
.catch(err => {
    console.log(err);
    res.send(err);
})
};

const loginGetController = (req, res, next) => {
    res.render('login.hbs')
};

const loginPostController = (req, res, next) => {
    console.log(req.body);

    const { email, password } = req.body;

    if(!email|| !password){
        res.render('login.hbs', {errorMessage: 'Sorry you forgot email or password'});
        return;
    }

User.fineOne ({ email })
.then(foundUser => {
    if(!foundUser){
        res.render('login.hbs', { errorMessage: 'Sorry user does not exist'})
        return;
    }

    const isValidPassword = bcryptjs.compareSync(password, foundUser.password);

    if(!isValidPassword){
        res.render('login.hbs', { errorMessage: 'Sorry wrong password'})
        return;
    }
    req.session.user = foundUser;

    res.redirect('/')
})
.catch(err => {
    console.log(err);
    res.send(err);
});

}


module.exports = {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
};
