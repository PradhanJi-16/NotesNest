import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    TextField,
    Button,
    Grid,
} from '@mui/material';
import './Notes.css';

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/notes', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotes(res.data);
            } catch (err) {
                console.error(err.response?.data);
            }
        };
        fetchNotes();
    }, [token]);

    useEffect(() => {
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    const addNote = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                'http://localhost:5000/api/notes',
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotes([...notes, res.data]);
            setTitle('');
            setContent('');
        } catch (err) {
            console.error(err.response?.data);
        }
    };

    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/notes/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            console.error("Error deleting note:", err);
        }
    };


    return (
        <div className="notes-container">
            <Typography variant="h4" gutterBottom>
                Your Notes
            </Typography>

            {/* Add Note Form */}
            <form onSubmit={addNote} style={{ marginBottom: '20px' }}>
                <TextField
                    label="Title"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Content"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    Add Note
                </Button>
            </form>

            {/* Notes Grid */}
            <Grid container spacing={2}>
                {notes.map((note) => (
                    <Grid item xs={12} sm={6} md={4} key={note._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{note.title}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {note.content}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(note._id)}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
