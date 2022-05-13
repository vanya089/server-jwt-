const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require("./config")
const tokenModel = require('./models/token-model');



const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: '15m' })

}


/* const generateRefreshToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, { expiresIn: '30d' })
}

const saveToken = (userId, generateRefreshToken) => {
    const tokenData = tokenModel.findOne({ user: userId })
    if (tokenData) {
        tokenData.generateRefreshToken = generateRefreshToken;
        return tokenData.save();
    }
    const token = tokenModel.create({user: userId, generateRefreshToken})
    return token;

} */




class authController {

    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Registration error", errors })
            };
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });

            if (candidate) {
                return res.status(400).json({ message: 'User with the same name already exists!' })
            };



            const hashPassword = bcrypt.hashSync(password, 5);
            const userRole = await Role.findOne({ value: 'USER' });
            const user = new User({ username, password: hashPassword, roles: [userRole.value] });
            await user.save();
            return res.json({ message: "User successfully registered" });



        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Registration error' });
        }
    }





    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: `User ${username} not found` })
            }

            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: `wrong password` })
            }

            const token = generateAccessToken(user._id, user.roles)
            return res.json({ token })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Login error' });
        }
    }






    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users);
        } catch (e) {

        }
    }



    async rename(req, res) {
        try {
            const users = await User.findByIdAndUpdate(req.params.id)
            res.json(users);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'error' });
        }
    }
    async delete(req, res) {
        try {
            const users = await User.findByIdAndDelete(req.params.id)
            res.json(users);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'error' });
        }
    }
}


module.exports = new authController()