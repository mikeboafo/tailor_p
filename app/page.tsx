'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Package,
  Shield,
  FileText,
  Menu,
  X,
  Star,
  Clock,
  Users,
  ChevronRight,
  Play,
  Sparkles,
} from 'lucide-react';
import Chatbot from './Chatbot/Chatbot'; 

export default function TailorLinkLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroImages = ['/t1.jpg', '/t2.jpg', '/t3.jpg', '/t4.jpg'];

  
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    const throttledScroll = () => {
      let ticking = false;
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    document.querySelectorAll('.observe-me').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const galleryImages = ['/t2.jpg', '/t3.jpg', '/t4.jpg', '/t5.jpg', '/t6.jpg', '/t7.jpg'];

  const features = [
    { 
      icon: MapPin, 
      title: 'Find Expert Tailors', 
      desc: 'Discover skilled professionals in your area with verified portfolios and reviews.',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      icon: Package, 
      title: 'Real-Time Tracking', 
      desc: 'Monitor every step of your order from measurement to final delivery.',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    { 
      icon: Users, 
      title: 'Grow Your Business', 
      desc: 'Tailors can expand their reach and manage clients efficiently.',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      icon: Clock, 
      title: 'Timely Delivery', 
      desc: 'Stay informed with smart notifications and deadline management.',
      gradient: 'from-blue-600 to-blue-700'
    },
    { 
      icon: Shield, 
      title: 'Secure & Safe', 
      desc: 'Protected payments and encrypted communications for peace of mind.',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    { 
      icon: Star, 
      title: 'Quality Assured', 
      desc: 'Only vetted professionals with proven track records and customer satisfaction.',
      gradient: 'from-blue-500 to-indigo-600'
    },
  ];

  const stats = [
    { number: '500+', label: 'Expert Tailors' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 30
            ? 'bg-white/98 backdrop-blur-xl shadow-md border-b border-gray-200'
            : 'bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
              aria-label="TailorLink Home"
            >
              <div className="relative w-auto h-10 transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/ti1.png"
                  alt="TailorLink"
                  width={40}
                  height={40}
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                scrollY > 30 ? 'text-gray-900' : 'text-white'
              }`}>
                TailorLink
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'features', 'gallery', 'download'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`relative text-sm font-medium transition-all duration-300 capitalize group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 ${
                    scrollY > 30 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-white hover:text-blue-300'
                  }`}
                  aria-label={`Scroll to ${section} section`}
                >
                  {section}
                  <span className={`absolute -bottom-1 left-3 right-3 h-0.5 transition-all duration-300 group-hover:w-full ${
                    scrollY > 30
                  }`} />
                </button>
              ))}
            </div>

            <button
              className={`md:hidden p-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                scrollY > 30 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div 
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            aria-hidden={!mobileMenuOpen}
          >
            <div className={`py-4 space-y-3 ${
              scrollY > 30 ? 'bg-white' : 'bg-black/80 backdrop-blur-xl'
            }`}>
              {['home', 'features', 'gallery', 'download'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`block w-full text-left px-4 py-3 capitalize transition-all duration-300 transform hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg ${
                    scrollY > 30 
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                      : 'text-white hover:text-blue-300 hover:bg-white/10'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>


      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero section"
      >

        <div className="absolute inset-0 z-0" aria-hidden="true">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <Image
                src={image}
                alt={`Tailor background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
            </div>
          ))}
        </div>


        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6">
          <Sparkles 
            className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4 sm:mb-6 animate-pulse-slow" 
            aria-hidden="true"
          />
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight observe-me">
            Perfect Fit.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 bg-clip-text text-transparent animate-gradient-x">
              Every Time.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed observe-me animation-delay-200">
            Connect with expert tailors, track your orders in real-time, and experience 
            custom clothing made just for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center observe-me animation-delay-400">
            <a
              href="https://play.google.com/store/apps/details?id=com.wgghana.tailorsuite"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-3 overflow-hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label="Download TailorLink app from Google Play"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Play className="w-5 h-5 relative z-10" aria-hidden="true" />
              <span className="relative z-10 text-sm sm:text-base">Download App</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
            
            <button
              onClick={() => scrollToSection('features')}
              className="group border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label="Learn more about TailorLink features"
            >
              <span className="text-sm sm:text-base">Learn More</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>

          <div className="flex justify-center space-x-2 mt-8 sm:mt-12" aria-label="Carousel indicators">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white ${
                  index === currentSlide
                    ? 'bg-white w-6 sm:w-8 h-2'
                    : 'bg-white/50 hover:bg-white/80 w-2 h-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce" aria-hidden="true">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden"
        aria-label="Features section"
      >
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-200 rounded-full blur-3xl opacity-20 -translate-y-48 translate-x-48 animate-float" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-100 rounded-full blur-3xl opacity-30 translate-y-48 -translate-x-48 animate-float-delayed" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 observe-me">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                TailorLink?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed observe-me animation-delay-200">
              Revolutionizing the tailoring experience with modern technology and 
              trusted craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map(({ icon: Icon, title, desc, gradient }, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 observe-me cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none"
                style={{ animationDelay: `${index * 100}ms` }}
                tabIndex={0}
              >
                <div className="relative mb-4 sm:mb-6">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className={`absolute -inset-2 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className="py-16 sm:py-20 bg-white relative overflow-hidden"
        aria-label="Gallery section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 observe-me">
              Craftsmanship
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed observe-me animation-delay-200">
              Explore the exceptional work of our verified tailoring professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1 sm:hover:-translate-y-2 observe-me focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none"
                style={{ animationDelay: `${index * 100}ms` }}
                tabIndex={0}
              >
                <div className="relative h-64 sm:h-80 overflow-hidden bg-gray-100">
                  <Image
                    src={img}
                    alt={`Tailoring work ${index + 1}`}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        id="download" 
        className="py-16 sm:py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden"
        aria-label="Download section"
      >
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400 rounded-full blur-3xl opacity-20 -translate-x-48 -translate-y-48 animate-float" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full blur-3xl opacity-30 translate-x-48 translate-y-48 animate-float-delayed" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="observe-me">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Tailoring Experience?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who trust TailorLink for perfect fits, reliable service, 
              and exceptional craftsmanship.
            </p>
          </div>

          <div className="observe-me animation-delay-200">
            <a
              href="https://play.google.com/store/apps/details?id=com.wgghana.tailorsuite"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 sm:gap-4 bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label="Download TailorLink app"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              Download TailorLink
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 observe-me animation-delay-400">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-blue-200 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden" aria-label="Footer">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-10 -translate-x-32 -translate-y-32" aria-hidden="true" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/ti1.png"
                  alt="TailorLink"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-lg sm:text-xl font-bold text-white">TailorLink</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">
                Connecting clients with expert tailors for the perfect fit, every time.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
              <div className="space-y-1 sm:space-y-2">
                {['home', 'features', 'gallery', 'download'].map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link)}
                    className="block text-gray-400 hover:text-white transition-all duration-300 capitalize text-left transform hover:translate-x-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <div className="space-y-1 sm:space-y-2">
                <Link 
                  href="/privacy-policy" 
                  className="block text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms-conditions" 
                  className="block text-gray-400 hover:text-white transition-all duration-300 transform hover:translate-x-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
              <p className="text-gray-400 text-xs sm:text-sm hover:text-white transition-colors duration-300">
                support@tailorlink.com
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm hover:text-gray-300 transition-colors duration-300">
              &copy; 2025 TailorLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <Chatbot />

      {/* Enhanced Global Styles */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(5deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(-5deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .observe-me {
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 25s ease-in-out infinite;
          animation-delay: -5s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        /* Focus styles for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Responsive text sizes */
        @media (max-width: 640px) {
          .text-responsive {
            font-size: clamp(1rem, 4vw, 1.5rem);
          }
        }
      `}</style>
    </div>
  );
}