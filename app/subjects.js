const path = require('path');
const express = require('express');
const multer = require('multer');
const nanoid = require('nanoid');
const config = require("../config");
const mysqlDB = require("../mysqlDB");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const router = express.Router();
const upload = multer({storage});

//все элементы
router.get('/', async (req, res) => {
    const data = await mysqlDB.getConnection().query("SELECT subject.id,subject.title, category.title as category, location.title as location FROM subject  " +
        "inner join category on category.id = subject.category_id " +
        "inner join location on location.id = subject.location_id");
    res.send(data.map(d => {
        return {
            id: d.id,
            title: d.title,
            category: d.category,
            location: d.location,
        }
    }));
});

//создание нового
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.body) {
        return res.status(400).send({error: "No title"});
    }
    let file = "";
    if (req.file) {
        file = req.file.filename;
    }
    const subject = req.body;
    const date = new Date().toLocaleString();
    if (subject.category_id && subject.location_id && subject.title) {
        try {
            const data = await mysqlDB.getConnection().query(`INSERT INTO subject (category_id, location_id, title, date_of_delivery, image) VALUES(?, ?, ?, ?, ?)`, [subject.category_id, subject.location_id, subject.title, date, file]);
            res.send({...subject, id: data.insertId, date_of_delivery: date, image: file});
        } catch (e) {
            console.log(e);
            return res.status(400).send({message: "Incorrect data entered"});
        }
    } else {
        res.status(400).send({error: "Required fields are not entered"});
    }
});

//элемент по id
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const data = await mysqlDB.getConnection().query("SELECT subject.id, subject.title, category.title as category, location.title as location, date_of_delivery, image " +
        "FROM subject " +
        "inner join category on category.id = subject.category_id " +
        "inner join location on location.id = subject.location_id " +
        "WHERE subject.id=?", [id]);
    if (!data[0]) {
        return res.status(404).send({message: "Not found"});
    }
    res.send(data[0]);
});

//удаление
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    await mysqlDB.getConnection().query("DELETE FROM subject WHERE id=?", [id]);
    res.send("ok");
});

//изменение
router.put("/:id", upload.single('image'), async (req, res) => {
    const id = req.params.id;
    if (!req.body) {
        return res.sendStatus(400);
    }
    const data = await mysqlDB.getConnection().query("SELECT * FROM subject WHERE id=?", [id]);

    let file = "";
    if (data[0].image) {
        file = data[0].image;
    }
    if (req.file) {
        console.log(file);
        file = req.file.filename;
    }
    try {
        const date = new Date().toLocaleString();
        await mysqlDB.getConnection().query("UPDATE subject SET category_id = ?, location_id = ?, title = ?, date_of_delivery = ?, image = ? WHERE id=?", [req.body.category_id, req.body.location_id, req.body.title, date, file, id]);
        const newData = await mysqlDB.getConnection().query("SELECT * FROM subject WHERE id=?", [id]);
        res.send(newData);
    } catch (e) {
        console.log(e);
        return res.status(400).send({message: "Incorrect data entered"});
    }
});


module.exports = router;