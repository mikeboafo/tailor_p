'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-300 text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-6">
            <FileText className="w-6 h-6 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Terms & Conditions</h1>
          </div>
          
          <div className="text-gray-700 space-y-6 text-sm leading-relaxed">
            <p className="text-base">
              Welcome to TailorLink. By accessing or using our platform, you agree to be bound by these 
              Terms and Conditions. Please read them carefully before using our services.
            </p>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
              <p>
                By creating an account, accessing, or using TailorLink services, you acknowledge that 
                you have read, understood, and agree to be bound by these Terms and Conditions. If you 
                do not agree with any part of these terms, you must not use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Service Description</h2>
              <p>
                TailorLink is a platform that connects clients with professional tailors. We provide:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>A marketplace for connecting clients with tailors</li>
                <li>Order management and tracking tools</li>
                <li>Payment processing services</li>
                <li>Communication tools between clients and tailors</li>
              </ul>
              <p className="text-sm">
                TailorLink acts as an intermediary and is not directly involved in the tailoring work 
                performed by service providers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">3. User Accounts</h2>
              <div className="space-y-2">
                <p><strong className="text-gray-900">Eligibility:</strong> You must be at least 18 years old to create an account and use our services.</p>
                <p><strong className="text-gray-900">Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                <p><strong className="text-gray-900">Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Client Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide accurate measurements and specifications for orders</li>
                <li>Communicate clearly with tailors about requirements</li>
                <li>Make timely payments for services rendered</li>
                <li>Provide constructive feedback and reviews</li>
                <li>Respect appointment times and deadlines</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Tailor Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Provide quality workmanship and materials</li>
                <li>Meet agreed-upon deadlines</li>
                <li>Maintain professional communication with clients</li>
                <li>Honor pricing and service agreements</li>
                <li>Address customer concerns promptly and professionally</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Payments and Fees</h2>
              <div className="space-y-2">
                <p><strong className="text-gray-900">Service Fees:</strong> TailorLink may charge platform fees for transactions processed through our system.</p>
                <p><strong className="text-gray-900">Payment Processing:</strong> All payments are processed securely through our trusted payment partners.</p>
                <p><strong className="text-gray-900">Refunds:</strong> Refund policies are determined by individual tailors and must be clearly communicated to clients before order confirmation.</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Dispute Resolution</h2>
              <p>In case of disputes between clients and tailors:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Parties should first attempt to resolve issues directly</li>
                <li>TailorLink may provide mediation services upon request</li>
                <li>We reserve the right to suspend accounts involved in unresolved disputes</li>
                <li>Legal disputes shall be resolved through arbitration in accordance with our dispute resolution policy</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Intellectual Property</h2>
              <p>
                All content on the TailorLink platform, including logos, designs, text, and software, 
                is the property of TailorLink and protected by intellectual property laws.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Limitation of Liability</h2>
              <p>TailorLink is not liable for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Quality of work performed by tailors</li>
                <li>Disputes between clients and tailors</li>
                <li>Delays or issues beyond our reasonable control</li>
                <li>Indirect, incidental, or consequential damages</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Termination</h2>
              <p>We reserve the right to suspend or terminate accounts that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Violate these Terms and Conditions</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Repeatedly receive poor ratings and complaints</li>
                <li>Otherwise misuse the platform</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">11. Changes to Terms</h2>
              <p>
                We may modify these Terms and Conditions at any time. Continued use of our services 
                after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">12. Governing Law</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the 
                laws of [Your Country/State], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Information</h2>
              <p>
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-2 space-y-1">
                <p><strong className="text-gray-900">Email:</strong> legal@tailorlink.com</p>
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