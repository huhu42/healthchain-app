'use client';

import React from 'react';
import Link from 'next/link';

export default function HypergraphPage() {
  const features = [
    {
      title: 'Private Health Space',
      description: 'Securely manage your personal health data with granular privacy controls',
      icon: '🔒',
      href: '/hypergraph/private-space',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Public Health Space',
      description: 'Share health insights, join challenges, and connect with the community',
      icon: '🌍',
      href: '/hypergraph/public-space',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Data Privacy',
      description: 'Control exactly who can access your health data with flexible sharing options',
      icon: '🛡️',
      href: '/hypergraph/private-space',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Health Analytics',
      description: 'Get insights from your health data with AI-powered analysis',
      icon: '📊',
      href: '/hypergraph/private-space',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const benefits = [
    {
      title: 'Decentralized',
      description: 'Your health data is stored on Hypergraph, not controlled by any single entity'
    },
    {
      title: 'Privacy-First',
      description: 'Granular control over who can access your data and for what purpose'
    },
    {
      title: 'Interoperable',
      description: 'Connect with various health devices and platforms seamlessly'
    },
    {
      title: 'Rewards',
      description: 'Earn rewards for achieving health goals and contributing to research'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Health Data,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Your Control
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Manage your personal health data with Hypergraph's decentralized, privacy-first platform. 
              Share what you want, keep private what you need, and earn rewards for your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/hypergraph/private-space"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Start Managing Your Data
              </Link>
              <Link
                href="/hypergraph/public-space"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Explore Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Health Data Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on Hypergraph's decentralized infrastructure for maximum privacy and control
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group block p-8 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-2xl text-white`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Hypergraph?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The future of health data management is decentralized, secure, and user-controlled
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Health Data?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already managing their health data with Hypergraph
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/hypergraph/private-space"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all"
            >
              Get Started Now
            </Link>
            <Link
              href="/hypergraph/public-space"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
