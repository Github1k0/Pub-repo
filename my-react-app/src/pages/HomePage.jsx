import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './HomePage.css'; // We will create this file for styling

// Placeholder hero image (replace with an actual image URL or import)
const heroImageUrl = 'https://via.placeholder.com/1920x1080.png?text=Hero+Banner';
const parallaxImageUrl = 'https://via.placeholder.com/1920x1080.png?text=Parallax+Background';

function HomePage() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const heroBannerRef = useRef(null);
  const parallaxSectionRef = useRef(null);

  useEffect(() => {
    // Animate title and subtitle
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
        // Adjust the '0.5' factor to change the speed of the parallax effect
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
          <h1 ref={titleRef}>Welcome to CryptoDash</h1>
          <p ref={subtitleRef}>Your one-stop platform for cryptocurrency tracking and analysis.</p>
          <button onClick={handleScrollToAbout} className="cta-button">
            Learn More
          </button>
        </div>
      </section>

      <section id="about-section" className="about-section">
        <h2>About Us</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
         <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>

      <section
        ref={parallaxSectionRef}
        className="parallax-section"
        style={{ backgroundImage: `url(${parallaxImageUrl})` }}
      >
        <div className="parallax-content">
          <h2>Discover More Features</h2>
          <p>Explore advanced charting tools and real-time data.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
