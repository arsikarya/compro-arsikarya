import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { publicApi } from '../lib/api';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import './Contact.css';

export default function Contact() {
    const [contactData, setContactData] = useState({
        phone: '+62 899-7932-802',
        email: 'webarsikarya@gmail.com',
        location: 'Bandung, Indonesia'
    });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        projectType: 'Design & Build',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const isFormValid = formData.firstName.trim() && formData.lastName.trim() && formData.email.trim() && formData.message.trim();

    useEffect(() => {
        publicApi.getContact()
            .then(data => {
                if (data) setContactData(data);
            })
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${API_URL}/api/contact/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSubmitStatus('success');
                setFormData({ ...formData, message: '' }); 
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            className="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Helmet>
                <title>Contact Us - PT ARSI KARYA UNGGUL</title>
                <meta name="description" content="Hubungi PT ARSI KARYA UNGGUL untuk kebutuhan konstruksi dan renovasi Anda." />
            </Helmet>

            <div className="contact-page">
                <div className="contact-card">
                    <div className="contact-info-panel">
                        <div className="info-content">
                            <h3>Contact Information</h3>
                            <p>Please fill out the form, and our team will get back to you within 24 hours.</p>

                            <div className="info-details">
                                {contactData?.phone && (
                                    <div className="info-item">
                                        <FiPhone />
                                        <span>{contactData.phone}</span>
                                    </div>
                                )}
                                {contactData?.email && (
                                    <div className="info-item">
                                        <FiMail />
                                        <span>{contactData.email}</span>
                                    </div>
                                )}
                                {contactData?.location && (
                                    <div className="info-item">
                                        <FiMapPin />
                                        <span>{contactData.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    
                        <div className="circle-deco small-circle"></div>
                        <div className="circle-deco large-circle"></div>
                    </div>

                    <div className="contact-form-panel">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Mail</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+62 812 3456 7890" />
                                </div>
                            </div>

                            <div className="form-group project-type-group">
                                <label className="group-label">What kind of service do you need?</label>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <input type="radio" name="projectType" value="Design & Build" checked={formData.projectType === 'Design & Build'} onChange={handleChange} />
                                        <span className="radio-custom"></span> Design & Build
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="projectType" value="Konstruksi" checked={formData.projectType === 'Konstruksi'} onChange={handleChange} />
                                        <span className="radio-custom"></span> Konstruksi
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="projectType" value="Renovasi" checked={formData.projectType === 'Renovasi'} onChange={handleChange} />
                                        <span className="radio-custom"></span> Renovasi
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="projectType" value="Other" checked={formData.projectType === 'Other'} onChange={handleChange} />
                                        <span className="radio-custom"></span> Other
                                    </label>
                                </div>
                            </div>

                            <div className="form-group message-group">
                                <label>Message</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} rows="4" placeholder="Write your message.." required></textarea>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={isSubmitting || !isFormValid}>
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                            
                            {submitStatus === 'success' && <p className="status-msg success">Message sent successfully!</p>}
                            {submitStatus === 'error' && <p className="status-msg error">Failed to send message. Please try again later.</p>}
                        </form>
                    </div>
                </div>
            </div>

            <footer className="home-footer delay-300 animate-fade-in">
                <p className="text-secondary text-sm">
                    © PT ARSI KARYA UNGGUL. All rights reserved.
                </p>
                <p className="text-secondary text-sm" style={{ textAlign: 'right' }}>
                    Bandung, Indonesia
                </p>
            </footer>
        </motion.div>
    );
}
