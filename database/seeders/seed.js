const bcrypt = require('bcrypt');
const {faker} = require('@faker-js/faker');
const User = require('../../Models/Student');

const seedUsers = async ()=> {
    try {
        const quantity = 5;
        const users = [];

        for(let i=0; i < quantity; i++) {
            users.push(
                new User({
                    student_id: faker.database.mongodbObjectId(),
                    first_name: faker.name.findName(),
                    last_name: faker.name.findName(),
                    email: faker.internet.email(),
                    phone: Number(`0907832189` + i),
                    phone2: faker.phone.number('+48 91 ### ## ##'),
                    password: 'mysecret',
                    date_of_birth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
                    gender: 1,
                    referal_code: Math.random().toString(36).slice(2, 9)
                })
            )
        }
        console.log(users)
        users.forEach(user => {
            User.create(user)
        })
        
    } catch (error){
        console.log(error)
    }
}

module.exports = { seedUsers };

