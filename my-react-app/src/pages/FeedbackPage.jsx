import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './FeedbackPage.css'; // We will create this file for styling

function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', or 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  const notificationRef = useRef(null); // Ref for the notification element

  useEffect(() => {
    if (submitMessage && notificationRef.current) {
      gsap.fromTo(
        notificationRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [submitMessage]);

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required.';
      isValid = false;
    } else if (formData.name.trim().length <= 2) {
      tempErrors.name = 'Name must be more than 2 characters.';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is not valid.';
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Optionally, re-validate on change after initial submit attempt or blur
    if (Object.keys(errors).length > 0) {
        validate();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmitMessage('');

    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify({
            title: `Feedback from ${formData.name}`, // JSONPlaceholder expects a title
            body: formData.message,
            userId: 1, // JSONPlaceholder expects a userId
            email: formData.email // Custom field
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-G',
          },
        });

        if (response.ok || response.status === 201) { // 201 is Created
          setSubmitStatus('success');
          setSubmitMessage('Feedback submitted successfully!');
          setFormData({ name: '', email: '', message: '' }); // Reset form
          setErrors({});
        } else {
          const errorData = await response.json().catch(() => null);
          setSubmitStatus('error');
          setSubmitMessage(`Failed to submit feedback. Server responded with ${response.status}. ${errorData?.message || ''}`);
        }
      } catch (error) {
        setSubmitStatus('error');
        setSubmitMessage(`Failed to submit feedback: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Effect to disable submit button if form is invalid
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    setIsFormValid(validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);


  return (
    <div className="feedback-page">
      <h1>Submit Your Feedback</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'invalid' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'invalid' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? 'invalid' : ''}
            rows="5"
          />
          {errors.message && <span className="error-message">{errors.message}</span>}
        </div>

        <button type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

        {submitMessage && (
          <div 
            ref={notificationRef} 
            className={`submit-notification ${submitStatus === 'success' ? 'success' : 'error'}`}
            // Initial style set by CSS or to avoid flash of unstyled content (FOUC)
            // style={{ opacity: 0 }} 
          >
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default FeedbackPage;
