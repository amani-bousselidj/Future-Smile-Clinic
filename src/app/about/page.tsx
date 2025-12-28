/**
 * About Page
 */
'use client';

import React from 'react';
import { Card } from '@/components/Card';
import { useFetch } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  bio?: string;
  photo?: string;
}

export default function AboutPage() {
  const { data: response, loading } = useFetch<{ results: Doctor[] }>('/api/doctors/');
  const doctors = response?.results || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">About Future Smile Clinic</h1>
        <p className="text-xl text-gray-600">
          Dedicated to providing the highest quality dental care since 2010
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card shadow="md">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To provide exceptional dental care that improves our patients' oral health and 
            overall well-being. We are committed to using the latest technology and techniques 
            to deliver outstanding results in a comfortable, caring environment.
          </p>
        </Card>

        <Card shadow="md">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be the most trusted dental clinic in the region, known for our expertise, 
            compassion, and commitment to patient satisfaction. We strive to make quality 
            dental care accessible to everyone.
          </p>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Excellence', icon: '⭐', desc: 'Highest standards in everything we do' },
            { title: 'Integrity', icon: '🤝', desc: 'Honest and ethical practices' },
            { title: 'Compassion', icon: '❤️', desc: 'Patient-centered care' },
            { title: 'Innovation', icon: '🔬', desc: 'Latest technology and techniques' },
          ].map((value, index) => (
            <Card key={index} shadow="sm">
              <div className="text-4xl mb-3">{value.icon}</div>
              <h3 className="font-bold text-lg mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Expert Team</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Card key={doctor.id} shadow="md">
                {doctor.photo && (
                  <img
                    src={doctor.photo}
                    alt={`Dr. ${doctor.first_name} ${doctor.last_name}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-bold mb-1">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h3>
                <p className="text-blue-600 font-semibold mb-3">{doctor.specialization}</p>
                {doctor.bio && (
                  <p className="text-gray-600">{doctor.bio}</p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No team members available</p>
        )}
      </div>

      {/* History */}
      <Card shadow="md" className="bg-blue-50 mb-16">
        <h2 className="text-2xl font-bold mb-4">Our Journey</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            <strong>2010:</strong> Future Smile Clinic was founded with a vision to revolutionize 
            dental care in the community.
          </p>
          <p>
            <strong>2015:</strong> Expanded with new state-of-the-art facilities and additional 
            specialists to our team.
          </p>
          <p>
            <strong>2018:</strong> Launched our digital transformation initiative, including 
            online appointment booking and telemedicine consultations.
          </p>
          <p>
            <strong>2023:</strong> Achieved accreditation as a leading dental clinic and expanded 
            our services to serve more patients.
          </p>
          <p>
            <strong>2024:</strong> Implemented advanced AI-assisted diagnostics and launched 
            our comprehensive digital health platform.
          </p>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { number: '14+', label: 'Years Experience' },
          { number: '10K+', label: 'Happy Patients' },
          { number: '20+', label: 'Specialists' },
          { number: '1000+', label: 'Procedures Monthly' },
        ].map((stat, index) => (
          <Card key={index} shadow="sm" className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
            <div className="text-gray-600">{stat.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
