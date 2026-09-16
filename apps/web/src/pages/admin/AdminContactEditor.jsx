import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './AdminProjectEditor.css';

export default function AdminContactEditor() {
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [defaultMessage, setDefaultMessage] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        adminApi.getContact()
            .then((data) => {
                if (data) {
                    setWhatsappNumber(data.whatsappNumber || '');
                    setDefaultMessage(data.defaultMessage || '');
                    setEmail(data.email || 'webarsikarya@gmail.com');
                    setPhone(data.phone || '');
                    setLocation(data.location || '');
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await adminApi.updateContact({ whatsappNumber, defaultMessage, email, phone, location });
            setMessage('✅ Saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('❌ Failed to save: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-project-editor">
            <div className="editor-header-bar">
                <div className="header-left">
                    <h3 className="section-title">Contact Page CMS</h3>
                    {message && <span style={{ marginLeft: '16px', fontSize: '0.9rem' }}>{message}</span>}
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>

            <div className="editor-layout" style={{ gridTemplateColumns: '1fr' }}>
                <div className="editor-panel animate-fade-in">
                    <h4 className="panel-title">Contact Information</h4>
                    <p className="text-secondary" style={{ marginBottom: '24px', fontSize: '0.9rem' }}>Configure the contact details shown on your Contact page.</p>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label>Email Address</label>
                        <input type="email" className="form-input text-lg" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. webarsikarya@gmail.com" />
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label>Phone Number (Display)</label>
                        <input type="text" className="form-input text-lg" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +62 899-7932-802" />
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label>Location / Address</label>
                        <input type="text" className="form-input text-lg" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bandung, Indonesia" />
                    </div>

                    <h4 className="panel-title" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '24px', marginTop: '24px' }}>WhatsApp Integration</h4>
                    
                    <div className="form-group">
                        <label>WhatsApp Number</label>
                        <input type="text" className="form-input text-lg" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="e.g. 628123... (include country code)" />
                        <span className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Fill numerical only including country code but without '+' sign.</span>
                    </div>

                    <div className="form-group" style={{ marginTop: '24px' }}>
                        <label>Default WhatsApp Message</label>
                        <textarea className="form-input" rows="5" value={defaultMessage} onChange={(e) => setDefaultMessage(e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
