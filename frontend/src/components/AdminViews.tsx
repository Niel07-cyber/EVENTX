import React, { useState } from 'react';
import type { Event, ViewState, TicketRequest } from '../types';
import { Plus, LogOut, Calendar, MapPin, Clock, Layout, Image as ImageIcon, Edit2, Trash2, Users, ArrowLeft, Search, AlertTriangle, Save } from 'lucide-react';

interface AdminViewsProps {
  view: ViewState;
  onNavigate: (view: ViewState, event?: Event) => void;
  events: Event[];
  ticketRequests: TicketRequest[];
  onAddEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEvent: (event: Event) => void;
  onLogout: () => void;
  selectedEvent: Event | null;
}

export const AdminViews: React.FC<AdminViewsProps> = ({ 
  view, 
  onNavigate, 
  events,
  ticketRequests,
  onAddEvent,
  onDeleteEvent,
  onUpdateEvent,
  onLogout,
  selectedEvent
}) => {
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Event Form State
  const [editingId, setEditingId] = useState<string | null>(null); // If not null, we are editing
  const [eventForm, setEventForm] = useState<Partial<Event>>({
    title: '',
    location: '',
    date: '',
    time: '',
    description: '',
    furtherInfo: '',
    type: 'Onsite',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000',
    price: 0
  });

  // Modal States
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // Helper to get applicant count
  const getApplicantCount = (eventId: string) => {
    return ticketRequests.filter(ticket => ticket.eventId === eventId).length;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onNavigate('admin_dashboard');
    } else {
      setLoginError('Invalid credentials (try admin/admin)');
    }
  };

  // --- ACTIONS ---

  const handleTabChange = (newView: ViewState) => {
    if (newView === 'admin_create_event') {
      // If manually clicking the tab, reset to "Create Mode"
      resetForm();
    }
    onNavigate(newView);
  };

  const resetForm = () => {
    setEditingId(null);
    setEventForm({
        title: '',
        location: '',
        date: '',
        time: '',
        description: '',
        furtherInfo: '',
        type: 'Onsite',
        category: 'Music',
        imageUrl: 'https://images.unsplash.com/photo-1459749411177-287ce3288b71?auto=format&fit=crop&q=80&w=1000',
        price: 0
    });
  };

  // Modify / Edit Click Handler
  const handleEditClick = (event: Event) => {
    setEditingId(event.id);
    setEventForm({ ...event });
    // Switch to the form view
    onNavigate('admin_create_event');
  };

  // Delete Click Handler
  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  // Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        // Update Logic
        const updatedEvent = { ...eventForm, id: editingId } as Event;
        onUpdateEvent(updatedEvent);
        resetForm();
        onNavigate('admin_dashboard');
    } else {
        // Create Logic - Show confirmation first
        setShowPublishModal(true);
    }
  };

  const confirmPublish = () => {
    const eventToAdd = {
      ...eventForm,
      id: Math.random().toString(36).substr(2, 9),
    } as Event;
    
    onAddEvent(eventToAdd);
    setShowPublishModal(false);
    resetForm();
    onNavigate('admin_dashboard');
  };

  // --- RENDER: LOGIN VIEW ---
  if (view === 'admin_login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
            <p className="text-sm text-gray-500 mt-2">Please sign in to manage events</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </button>
            <div className="text-center">
                <button type="button" onClick={() => onNavigate('home')} className="text-sm text-gray-500 hover:text-gray-900">Back to Home</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: APPLICANT LIST VIEW ---
  if (view === 'admin_event_applicants' && selectedEvent) {
    const eventApplicants = ticketRequests.filter(t => t.eventId === selectedEvent.id);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-4">
                 <button onClick={() => onNavigate('admin_dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                 </button>
                 <h1 className="text-xl font-bold text-gray-900">Applicants: <span className="text-primary">{selectedEvent.title}</span></h1>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={onLogout} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                   <div>
                      <h2 className="text-lg font-medium text-gray-900">Registered Attendees</h2>
                      <p className="text-sm text-gray-500 mt-1">Total count: {eventApplicants.length}</p>
                   </div>
                   <button className="text-sm bg-white border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700">
                      Export CSV
                   </button>
                </div>
                
                {eventApplicants.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p>No applicants yet for this event.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {eventApplicants.map((applicant) => (
                          <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs mr-3">
                                  {applicant.firstName.charAt(0)}{applicant.lastName.charAt(0)}
                                </div>
                                <div className="text-sm font-medium text-gray-900">{applicant.firstName} {applicant.lastName}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.gender}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(applicant.timestamp).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
        </main>
      </div>
    );
  }

  // --- RENDER: SHARED DASHBOARD LAYOUT ---
  if (view === 'admin_dashboard' || view === 'admin_create_event') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 flex items-center">
                   <span className="text-xl font-bold text-gray-900">EVENT <span className="text-primary">Xa</span></span>
                   <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 uppercase">Admin</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:block">Welcome, Administrator</span>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => handleTabChange('admin_dashboard')}
                className={`${
                  view === 'admin_dashboard'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <Layout size={18} />
                All Events
              </button>
              <button
                onClick={() => handleTabChange('admin_create_event')}
                className={`${
                  view === 'admin_create_event'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
                {editingId ? 'Modify Event' : 'Create New Event'}
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
          
          {/* VIEW: DASHBOARD (GRID) */}
          {view === 'admin_dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
                 <button 
                    onClick={() => handleTabChange('admin_create_event')}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors shadow-sm font-medium"
                 >
                    <Plus size={20} />
                    New Event
                 </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <Layout className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => handleTabChange('admin_create_event')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-teal-600 focus:outline-none"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      New Event
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => {
                    const applicantCount = getApplicantCount(event.id);
                    return (
                      <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                        <div className="relative h-48 w-full bg-gray-200">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${event.type === 'Remote' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-800'}`}>
                                {event.type || 'Onsite'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-primary mb-1">{event.category}</p>
                              {/* Applicant Count Badge */}
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                                <Users size={14} />
                                <span className="text-xs font-bold">{applicantCount} Applied</span>
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar size={16} className="mr-2 text-gray-400" />
                                {event.date}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock size={16} className="mr-2 text-gray-400" />
                                {event.time}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin size={16} className="mr-2 text-gray-400" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            {/* Action Buttons */}
                            <button 
                              onClick={() => onNavigate('admin_event_applicants', event)}
                              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Users size={16} />
                              View Applicants
                            </button>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditClick(event)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                  title="Modify Event"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(event)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                  title="Delete Event"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {event.price === 0 ? 'Free' : `$${event.price}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW: CREATE/EDIT EVENT (FORM) */}
          {view === 'admin_create_event' && (
            <div className="max-w-4xl mx-auto">
               <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Modify Event' : 'Create New Event'}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {editingId ? 'Update the details below for this event.' : 'Fill in the details below to publish a new event.'}
                      </p>
                    </div>
                    {editingId && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wide">
                        Editing Mode
                      </span>
                    )}
                  </div>
                  
                  <form onSubmit={handleFormSubmit} className="p-6 md:p-8 space-y-8">
                      {/* Event Details Section */}
                      <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Event Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                                <input type="text" required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="e.g. Summer Music Festival" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value as any})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white">
                                  <option>Music</option>
                                  <option>Sports</option>
                                  <option>Arts & Theatre</option>
                                  <option>Festivals</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                                <select value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as any})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white">
                                  <option>Onsite</option>
                                  <option>Remote</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required rows={4} value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Describe the event..." />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Further Information (Optional)</label>
                                <textarea rows={2} value={eventForm.furtherInfo} onChange={e => setEventForm({...eventForm, furtherInfo: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Any additional details like parking, age restrictions..." />
                            </div>
                        </div>
                      </div>

                      {/* Date & Location Section */}
                      <div className="space-y-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Date & Location</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="text" required value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="e.g. Sat, Sep 23" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input type="text" required value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="e.g. 4:00 PM" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Venue / Address</label>
                                <input type="text" required value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="e.g. Central Park, NYC" />
                            </div>
                        </div>
                      </div>

                      {/* Media Section */}
                      <div className="space-y-6 pt-6 border-t border-gray-100">
                         <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Media</h3>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                            <div className="flex gap-4 items-start">
                              <div className="flex-1">
                                <input type="url" required value={eventForm.imageUrl} onChange={e => setEventForm({...eventForm, imageUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="https://..." />
                                <p className="text-xs text-gray-500 mt-1">Paste a direct link to an image (Unsplash, etc.)</p>
                              </div>
                              <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                {eventForm.imageUrl ? (
                                  <img src={eventForm.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '')} />
                                ) : (
                                  <ImageIcon className="text-gray-300" />
                                )}
                              </div>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                         <button type="button" onClick={() => onNavigate('admin_dashboard')} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                         </button>
                         <button 
                            type="submit" 
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium shadow-md transform hover:-translate-y-0.5 transition-all text-white flex items-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-teal-600'}`}
                         >
                            {editingId ? <Save size={18} /> : <Plus size={18} />}
                            {editingId ? 'Modify Event' : 'Publish Event'}
                         </button>
                      </div>
                  </form>
               </div>
            </div>
          )}
        </main>

        {/* Delete Confirmation Modal */}
        {eventToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-900 bg-opacity-60 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setEventToDelete(null)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">Delete Event?</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete <span className="font-bold text-gray-900">{eventToDelete.title}</span>?
                        </p>
                        <p className="text-sm text-red-500 mt-2">
                          This action cannot be undone and will remove the event from the public listing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button onClick={confirmDelete} type="button" className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm">
                    Yes, Delete
                  </button>
                  <button onClick={() => setEventToDelete(null)} type="button" className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Confirmation Modal */}
        {showPublishModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-900 bg-opacity-60 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setShowPublishModal(false)}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Layout className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-bold text-gray-900" id="modal-title">Confirm Publication</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to publish <span className="font-bold text-gray-900">{eventForm.title}</span>?
                        </p>
                        <ul className="mt-3 text-sm text-gray-500 list-disc list-inside bg-gray-50 p-3 rounded-lg">
                           <li>Visible to all users immediately</li>
                           <li>Date: {eventForm.date}</li>
                           <li>Location: {eventForm.location}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button onClick={confirmPublish} type="button" className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:w-auto sm:text-sm">
                    Publish Now
                  </button>
                  <button onClick={() => setShowPublishModal(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}