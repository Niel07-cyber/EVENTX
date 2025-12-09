import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ArrowLeft, CheckCircle, Info } from 'lucide-react';
import type { Event, TicketRequest } from '../types';

interface EventDetailsProps {
  event: Event;
  onBack: () => void;
  onSubmitApplication: (data: Omit<TicketRequest, 'id' | 'timestamp'>) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onBack, onSubmitApplication }) => {
  const [step, setStep] = useState<'details' | 'form' | 'success'>('details');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    gender: 'Prefer not to say',
    agreedToPolicy: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agreedToPolicy: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to Database (via App.tsx handler)
    onSubmitApplication({
      eventId: event.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      gender: formData.gender,
      agreedToPolicy: formData.agreedToPolicy
    });

    // Show success state
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary p-8 text-center">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Application Received!</h2>
            <p className="text-white/90">Your ticket request is being processed.</p>
          </div>
          <div className="p-8">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                </div>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">TEMPLATE</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Attendee:</span> {formData.firstName} {formData.lastName}</p>
                <p><span className="font-medium">Venue:</span> {event.location}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-400 italic">QR Code will be sent via email upon final confirmation.</p>
              </div>
            </div>
            <button 
              onClick={onBack}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute top-0 left-0 p-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
          <div className="container mx-auto">
            <span className="inline-block px-3 py-1 bg-primary rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm md:text-base font-medium">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this Event</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {event.description || "Join us for this amazing event. It's going to be an unforgettable experience with great atmosphere and company."}
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-500 mt-1 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">Additional Information</h4>
                    <p className="text-blue-800 text-sm mt-1">{event.furtherInfo || "No additional information provided."}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-sm text-gray-500 mb-1">Event Type</span>
                  <span className="font-semibold text-gray-900">{event.type || 'Onsite'}</span>
               </div>
               <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-sm text-gray-500 mb-1">Cost</span>
                  <span className="font-semibold text-primary">{event.price === 0 ? 'Free Entry' : `$${event.price}`}</span>
               </div>
            </div>
          </div>

          {/* Ticket/Application Form Side */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 md:p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Request Tickets</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={formData.agreedToPolicy}
                      onChange={handleCheckboxChange}
                      className="mt-1 h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      I agree to the <a href="#" className="text-primary hover:underline">Confidentiality Policy</a> and terms of service. I understand that this is a request for a ticket and final confirmation will be sent via email.
                    </span>
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-bold shadow-md hover:bg-teal-600 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Apply for Ticket
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;