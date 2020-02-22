const User = require('../models/User')
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email}) // Находим пользователя с таким email
    
    if (candidate) {
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password) 
        if (passwordResult) {
        // Пароль введен верно, генерируем токен
        const token = jwt.sign({
            email: candidate.email,
            userId: candidate._id
        }, keys.jwt, {expiresIn: 3600})
        res.status(200).json({
            token: `Bearer ${token}`
        })
        } else {
            res.status(401).json({message:'Пароли не совпадают'})
        }                                             
    } else {
        res.status(404).json({message: 'пользователь с таким email не найден'})       // Пользователь не найден
    }
}

module.exports.register = async function(req, res) { // регистрация
 
   const candidate = await User.findOne({email: req.body.email}) // Находим пользователя с таким email

    if(candidate){
        res.status(409).json({message: 'Такой Email  уже занят, попробуйте другой'}) // Если найдено - отказываем
    } else {
        const password = req.body.password
        const salt = bcrypt.genSalt(10)
        const user = new User({
            email: req.body.email,           // если ОК, создаем нового пользователя и шифруем пароль
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()                         // Сохраняем
            res.status(201)
        } catch(e) {
            console.log(e)                                   // ловим ошибку
        }
    }
}
