const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * @swagger
 * tags:
 *   name: Greetings
 *   description: API to manage greetings.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Greeting:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the greeting.
 *         message:
 *           type: string
 *           description: The greeting message.
 *       example:
 *         id: 1
 *         message: Hello, world!
 */

/**
 * @swagger
 * /api/greetings:
 *   get:
 *     summary: Retrieve a list of greetings.
 *     tags: [Greetings]
 *     responses:
 *       200:
 *         description: A list of greetings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Greeting'
 */
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM greetings';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

/**
 * @swagger
 * /api/greetings/{id}:
 *   get:
 *     summary: Get a greeting by ID.
 *     tags: [Greetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The greeting ID.
 *     responses:
 *       200:
 *         description: The greeting description by ID.
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Greeting'
 *       404:
 *         description: Greeting not found.
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM greetings WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: 'Greeting not found' });
    }
  });
});

/**
 * @swagger
 * /api/greetings:
 *   post:
 *     summary: Create a new greeting.
 *     tags: [Greetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Greeting'
 *     responses:
 *       201:
 *         description: Greeting created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Greeting'
 *       400:
 *         description: Bad request.
 */
router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ message: 'Message is required' });
    return;
  }
  const sql = 'INSERT INTO greetings (message) VALUES (?)';
  const params = [message];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, message });
  });
});

/**
 * @swagger
 * /api/greetings/{id}:
 *   put:
 *     summary: Update a greeting by ID.
 *     tags: [Greetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The greeting ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Greeting'
 *     responses:
 *       200:
 *         description: Greeting updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Greeting'
 *       400:
 *         description: Bad request.
 *       404:
 *         description: Greeting not found.
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ message: 'Message is required' });
    return;
  }
  const sql = 'UPDATE greetings SET message = ? WHERE id = ?';
  const params = [message, id];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Greeting not found' });
      return;
    }
    res.json({ id: Number(id), message });
  });
});

/**
 * @swagger
 * /api/greetings/{id}:
 *   delete:
 *     summary: Delete a greeting by ID.
 *     tags: [Greetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The greeting ID.
 *     responses:
 *       200:
 *         description: Greeting deleted successfully.
 *       404:
 *         description: Greeting not found.
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM greetings WHERE id = ?';
  db.run(sql, id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: 'Greeting not found' });
      return;
    }
    res.json({ message: 'Greeting deleted successfully' });
  });
});

module.exports = router;