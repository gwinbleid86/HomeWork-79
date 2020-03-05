const express = require('express');
const mysqlDB = require("../mysqlDB");

const router = express.Router();

//все элементы
router.get('/', async (req, res) => {
    const data = await mysqlDB.getConnection().query("SELECT * FROM location");
    res.send(data.map(d => {
        return {
            id: d.id,
            title: d.title
        }
    }));
});

//создание нового
router.post('/', async (req, res) => {
    if (!req.body) {
        res.status(400).send({error: "Error"});
    }
    const location = req.body;
    if (location.title) {
        try{
            let discription = category.discription ? category.discription : "";
            const data = await mysqlDB.getConnection().query(`INSERT INTO location (title, discription) VALUES (?, ?)`, [category.title, discription]);
            res.send({...category, id: data.insertId});
        }
        catch (e) {
            console.log(e);
            return res.status(400).send({message: "Incorrect data entered"});
        }
    } else {
        res.status(400).send({error: "Not written title of location"});
    }
});

//элемент по id
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const data = await mysqlDB.getConnection().query("SELECT * FROM location WHERE id=?", [id]);
    if (!data[0]) {
        return res.status(404).send({message: "Not found"});
    }
    res.send(data[0]);
});

//удаление
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const relatedRecords = await mysqlDB.getConnection().query("SELECT * FROM subject WHERE location_id=?", [id]);
    if (relatedRecords.length > 0) {
        res.send("Cannot be deleted, there are related records");
    } else {
        await mysqlDB.getConnection().query("DELETE FROM location WHERE id=?", [id]);
        res.send("ok");
    }
});

//изменение
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    if (!req.body) {
        return res.sendStatus(400);
    }
    try {
        await mysqlDB.getConnection().query("UPDATE subject SET title = ?, discription = ? WHERE id=?", [req.body.title, req.body.discription, id]);
        const data = await mysqlDB.getConnection().query("SELECT * FROM subject WHERE id=?", [id]);
        res.send(data);
    } catch (e) {
        console.log(e);
        return res.status(400).send({message: "Incorrect data entered"});
    }
});


module.exports = router;