'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-300 text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
          </div>
          
          <div className="text-gray-700 space-y-6 text-sm leading-relaxed">
            <p className="text-base">
              At TailorLink, we are committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, and safeguard your 
              data when you use our platform.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
              <p><strong className="text-gray-900">Personal Information:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Name, email address, phone number, and contact details</li>
                <li>Location data to help find nearby tailors and service providers</li>
                <li>Order details, measurements, preferences, and transaction history</li>
                <li>Payment information processed through secure payment partners</li>
                <li>Device information, operating system, and app usage statistics</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Connect you with qualified tailors in your area</li>
                <li>Process and manage your tailoring orders</li>
                <li>Provide real-time order tracking and updates</li>
                <li>Facilitate secure payments and transactions</li>
                <li>Improve our platform and user experience</li>
                <li>Send important service notifications and updates</li>
                <li>Provide customer support and resolve issues</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encryption of sensitive data during transmission and storage</li>
                <li>Secure servers with regular security updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Regular security audits and vulnerability assessments</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Third-Party Services</h2>
              <p>We may use trusted third-party services for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Payment processing (Google Pay, credit card processors)</li>
                <li>Cloud storage and hosting services</li>
                <li>Analytics and performance monitoring</li>
                <li>Customer support tools</li>
              </ul>
              <p className="text-sm">
                These service providers are contractually obligated to protect your data and may only 
                use it for the specific services they provide.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience, analyze 
                platform usage, and deliver personalized content. You can control cookie preferences 
                through your browser settings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not knowingly 
                collect personal information from children. If we become aware that we have collected 
                personal information from a child, we will take steps to delete such information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your data in accordance with 
                this Privacy Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Policy Updates</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any significant 
                changes through the app or via email. Continued use of our services after such changes 
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy or how we handle your data, 
                please contact us at:
              </p>
              <div className="mt-2 space-y-1">
                <p><strong className="text-gray-900">Email:</strong> privacy@tailorlink.com</p>
                <p><strong className="text-gray-900">Address:</strong> info@wgghana.com</p>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Last updated: January 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}