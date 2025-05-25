import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './FeedbackPage.css'; 

function FeedbackPage() {
  const { t } = useTranslation(); // Initialize useTranslation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [submitMessage, setSubmitMessage] = useState('');
  const notificationRef = useRef(null); 

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

    if (!formData.name.trim()) {
      tempErrors.name = t('feedback_validation_name_required');
      isValid = false;
    } else if (formData.name.trim().length <= 2) {
      tempErrors.name = t('feedback_validation_name_length');
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = t('feedback_validation_email_required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = t('feedback_validation_email_invalid');
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = t('feedback_validation_message_required');
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };
  
  // Re-run validation when language changes to update error messages
  useEffect(() => {
    if (Object.keys(errors).length > 0) { // Only if there are existing errors
        validate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]); // Dependency on t function (which changes with language)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
            title: `Feedback from ${formData.name}`, 
            body: formData.message,
            userId: 1, 
            email: formData.email 
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-G',
          },
        });

        if (response.ok || response.status === 201) { 
          setSubmitStatus('success');
          setSubmitMessage(t('feedback_submit_success'));
          setFormData({ name: '', email: '', message: '' }); 
          setErrors({});
        } else {
          const errorData = await response.json().catch(() => null);
          setSubmitStatus('error');
          setSubmitMessage(t('feedback_submit_error_server', { status: response.status, message: errorData?.message || '' }));
        }
      } catch (error) {
        setSubmitStatus('error');
        setSubmitMessage(t('feedback_submit_error_network', { message: error.message }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    setIsFormValid(validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, t]); // Add t to dependency array for isFormValid as validate now uses t

  return (
    <div className="feedback-page">
      <h1>{t('feedback_page_title')}</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">{t('feedback_label_name')}</label>
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
          <label htmlFor="email">{t('feedback_label_email')}</label>
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
          <label htmlFor="message">{t('feedback_label_message')}</label>
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
          {isSubmitting ? t('feedback_button_submitting') : t('feedback_button_submit')}
        </button>

        {submitMessage && (
          <div 
            ref={notificationRef} 
            className={`submit-notification ${submitStatus === 'success' ? 'success' : 'error'}`}
          >
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default FeedbackPage;
