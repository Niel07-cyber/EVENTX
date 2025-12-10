import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import EventCard from './components/EventCard';
import Footer from './components/Footer';
import EventDetails from './components/EventDetails';
import { AdminViews } from './components/AdminViews';
import { eventAPI, ticketAPI } from './services/api';
import type { Category, Event, ViewState, TicketRequest } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Events');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State from database
  const [events, setEvents] = useState<Event[]>([]);
  const [ticketRequests, setTicketRequests] = useState<TicketRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, ticketsData] = await Promise.all([
          eventAPI.getAll(),
          ticketAPI.getAll()
        ]);
        setEvents(eventsData);
        setTicketRequests(ticketsData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please make sure the backend server is running.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation Handler
  const navigate = (newView: ViewState, eventData?: Event) => {
    if (eventData) {
      setSelectedEvent(eventData);
    }
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleAddEvent = async (newEvent: Event) => {
    try {
      const createdEvent = await eventAPI.create(newEvent);
      setEvents(prev => [createdEvent, ...prev]);
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventAPI.delete(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event');
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      const updated = await eventAPI.update(updatedEvent.id, updatedEvent);
      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update event');
    }
  };

  const handleTicketSubmit = async (request: Omit<TicketRequest, 'id' | 'timestamp'>) => {
    try {
      const newTicket: TicketRequest = {
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      };
      const createdTicket = await ticketAPI.create(newTicket);
      setTicketRequests(prev => [...prev, createdTicket]);
    } catch (err) {
      console.error('Error creating ticket request:', err);
      alert('Failed to submit ticket request');
    }
  };

  // Filter Logic
  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by category
    if (selectedCategory !== 'All Events') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedCategory, events, searchQuery]);

  // View Routing
  if (view.startsWith('admin')) {
    return (
      <AdminViews 
        view={view} 
        onNavigate={navigate} 
        events={events} 
        ticketRequests={ticketRequests}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
        onUpdateEvent={handleUpdateEvent}
        selectedEvent={selectedEvent}
        onLogout={() => navigate('home')}
      />
    );
  }

  if (view === 'event_details' && selectedEvent) {
    return (
      <EventDetails 
        event={selectedEvent} 
        onBack={() => navigate('home')} 
        onSubmitApplication={handleTicketSubmit}
      />
    );
  }

  // Home View
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-secondary">
      <Navbar onNavigate={navigate} currentPage={view} />
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="-mt-16 md:-mt-24 pb-20 relative z-10">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <div className="container mx-auto px-6">
          {/* Loading state */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-500">Loading events...</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-xl text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Events grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={(e) => navigate('event_details', e)}
                />
              ))}
            </div>
          )}
          
          {!loading && !error && filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">
                {searchQuery.trim() 
                  ? `No events found matching "${searchQuery}"` 
                  : 'No events found for this category.'}
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory('All Events');
                  setSearchQuery('');
                }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;