import { useState } from 'react';
import axios from 'axios';
import { Scanner } from '@yudiel/react-qr-scanner';

const VolunteerScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [manualCode, setManualCode] = useState('');
    const [status, setStatus] = useState(null); // 'success' or 'error'
    const [message, setMessage] = useState('');

    const handleScan = async (code) => {
        if (!code || scanResult === code) return; // Prevent multiple scans of same code
        setScanResult(code);
        verifyTicket(code);
    };

    const verifyTicket = async (qrToken) => {
        try {
            setStatus(null);
            const res = await axios.post('http://localhost:5000/api/tickets/verify', { qrToken });
            
            if (res.data.valid) {
                setStatus('success');
                setMessage(✅ ${res.data.message} - Welcome ${res.data.attendee.name}!);
            }
        } catch (err) {
            setStatus('error');
            if (err.response) {
                setMessage(❌ ${err.response.data.message});
            } else {
                setMessage('❌ Network Error');
            }
        }
        
        // Reset scan result after 3 seconds to allow next scan
        setTimeout(() => setScanResult(null), 3000);
    };

    return (
        <div className="container" style={{ textAlign: 'center' }}>
            <h2>Ticket Scanner</h2>
            
            {/* Status Message */}
            {status && (
                <div className={status === 'success' ? 'alert alert-success' : 'alert alert-danger'}>
                    <h2>{message}</h2>
                </div>
            )}

            <div className="card">
                <Scanner 
                    onScan={(result) => {
                        if (result && result.length > 0) handleScan(result[0].rawValue);
                    }}
                    styles={{ container: { width: '100%', height: '300px' } }}
                />
            </div>

            <div className="card">
                <h3>Manual Entry</h3>
                <input 
                    placeholder="Enter Ticket ID manually" 
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                />
                <button className="btn" onClick={() => verifyTicket(manualCode)}>Check In</button>
            </div>
        </div>
    );
};

export default VolunteerScanner;
