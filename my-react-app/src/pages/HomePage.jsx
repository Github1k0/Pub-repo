import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './HomePage.css'; 

// Placeholder hero image
const heroImageUrl = 'https://via.placeholder.com/1920x1080.png?text=Hero+Banner';
const parallaxImageUrl = 'https://via.placeholder.com/1920x1080.png?text=Parallax+Background';

function HomePage() {
  const { t } = useTranslation(); // Initialize useTranslation
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const heroBannerRef = useRef(null);
  const parallaxSectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxSectionRef.current) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        parallaxSectionRef.current.style.backgroundPositionY = `${scrollTop * 0.5}px`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-page">
      <section
        ref={heroBannerRef}
        className="hero-banner"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="hero-content">
          <h1 ref={titleRef}>{t('home_hero_title')}</h1>
          <p ref={subtitleRef}>{t('home_hero_subtitle')}</p>
          <button onClick={handleScrollToAbout} className="cta-button">
            {t('home_hero_cta')}
          </button>
        </div>
      </section>

      <section id="about-section" className="about-section">
        <h2>{t('home_about_title')}</h2>
        <p>{t('home_about_p1')}</p>
        <p>{t('home_about_p2')}</p>
        <p>{t('home_about_p3')}</p>
      </section>

      <section
        ref={parallaxSectionRef}
        className="parallax-section"
        style={{ backgroundImage: `url(${parallaxImageUrl})` }}
      >
        <div className="parallax-content">
          <h2>{t('home_parallax_title')}</h2>
          <p>{t('home_parallax_subtitle')}</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
