const path = require('path');

const express = require('express');
const multer = require('multer');
const nanoid = require('nanoid');

const fileDb = require('../fileDb');
const config = require('../config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await fileDb.getItems();
  res.send(items);
});

router.get('/:id', async (req, res) => {
  const item = await fileDb.getItemById(req.params.id);
  res.send(item);
});

router.post('/', upload.single('image'), async (req, res) => {
  const product = req.body;

  if (req.file) {
    product.image = req.file.filename;
  }

  await fileDb.addItem(product);
  res.send(req.body.id);
});

module.exports = router;