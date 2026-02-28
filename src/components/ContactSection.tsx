import React, { useState } from 'react';
import axios from 'axios';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error('VITE_API_URL not defined in portfolio contact form');
}
console.log('[portfolio] contact API_URL', API_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Use API_URL from env
      await axios.post(`${API_URL}/api/messages`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact-section" className="section contact-section">
      <div className="section-header">
        <span className="section-tag">Get in Touch</span>
        <h2 className="section-title">Leave a Message</h2>
        <div className="section-line" />
      </div>

      <form className="contact-form glass" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="form-input"
            placeholder="Your Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
            placeholder="Your Email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            className="form-input"
            rows={5}
            placeholder="Tell me something..."
          />
        </div>
        <button type="submit" className="form-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>

        {status === 'success' && <p style={{ color: 'var(--primary)', textAlign: 'center' }}>Message sent successfully!</p>}
        {status === 'error' && <p style={{ color: '#ff5f57', textAlign: 'center' }}>Failed to send message. Try again.</p>}
      </form>
    </section>
  );
};

export default ContactSection;
