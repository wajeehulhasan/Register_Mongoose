import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/connection.js';
import Userdb from './model/model.js';

const app = express();

dotenv.config({ path: 'config.env' });

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

// app.get('/all_user', (req, res) => {
//     if (req.query.id) {
//         const id = req.query.id;
//         Userdb.findById(id)
//             .then(data => {
//                 if (!data) {
//                     res.status(404).send({ message: "not found user with id : " + id })
//                 } else {
//                     res.send(data)
//                 }
//             })
//             .catch(err => {
//                 res.status(500).send({ message: "error in retriving user with id : " + id })
//             })
//     } else {
//         Userdb.find()
//             .then(user => {
//                 res.send(user)
//             })
//             .catch(err => {
//                 res.status(500).send({ message: err.message || "error occured while retriving user info" })
//             })
//     }
// });

app.get('/all_user', (req, res) => {
    Userdb.find()
        .then(users => {
            res.render('all_user', { users });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "some error occur while retrieving users"
            })
        });
});

app.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    console.log('Received data:', req.body, name, email, phone, password);

    if (!req.body) {
        res.status(400).send({ message: "content cannot be empty" })
        return;
    }

    const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
    })

    user
        .save(user)
        .then(data => {
            // res.send(data)
            res.redirect('/all_user')
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "some error occur while creating a create operation"
            })
        })
})



const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
