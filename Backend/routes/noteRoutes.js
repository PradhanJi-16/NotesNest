const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new note
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title, content, user: req.user });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all notes for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a note (only if it belongs to the logged-in user)
router.put('/:id', auth, async (req, res) => {
    const { title, content } = req.body;
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found!' });
        }
        if (!note.user || note.user.toString() !== req.user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        note.title = title;
        note.content = content;
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a note (only if it belongs to the logged-in user)
router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found!' });
        }

        // Compare the note's user ObjectId with the logged-in user's id (stored in req.user)
        if (!note.user || note.user.toString() !== req.user) {
            return res.status(403).json({ message: 'Unauthorized' });
        }


        await note.deleteOne();
        res.json({ message: 'Note deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;