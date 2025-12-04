import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { token } = useContext(AuthContext);
    const [form, setForm] = useState({ name: '', date: '', location: '', price: '' });
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/events', form, { headers: { Authorization: token } });
            alert('Event Created!');
            fetchEvents();
        } catch (err) {
            alert('Error creating event');
        }
    };

    const loadStats = async (eventId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/events/${eventId}/stats`, { headers: { Authorization: token } });
            setStats({ ...stats, [eventId]: res.data });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h2>Admin Dashboard</h2>
            
            <div className="card">
                <h3>Create Event</h3>
                <form onSubmit={handleCreate}>
                    <input placeholder="Event Name" onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input type="date" onChange={e => setForm({ ...form, date: e.target.value })} />
                    <input placeholder="Location" onChange={e => setForm({ ...form, location: e.target.value })} />
                    <input placeholder="Price" type="number" onChange={e => setForm({ ...form, price: e.target.value })} />
                    <button className="btn">Create</button>
                </form>
            </div>

            <h3>Live Stats</h3>
            {events.map(ev => (
                <div key={ev._id} className="card">
                    <h4>{ev.name}</h4>
                    <button className="btn" onClick={() => loadStats(ev._id)}>Refresh Stats</button>
                    {stats[ev._id] && (
                        <div style={{ marginTop: '10px' }}>
                            <p>Total Sold: <strong>{stats[ev._id].totalRegistrations}</strong></p>
                            <p>Checked In: <strong>{stats[ev._id].actualCheckins}</strong></p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AdminDashboard;
