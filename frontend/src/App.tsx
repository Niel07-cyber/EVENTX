import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import EventCard from './components/EventCard';
import Footer from './components/Footer';
import EventDetails from './components/EventDetails';
import { AdminViews } from './components/AdminViews';
import { EVENTS as INITIAL_EVENTS } from './data/events';
import type { Category, Event, ViewState, TicketRequest } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Events');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // This state simulates your PostgreSQL Database 'events' table
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  
  // This state simulates your PostgreSQL Database 'ticket_requests' table
  const [ticketRequests, setTicketRequests] = useState<TicketRequest[]>([]);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Navigation Handler
  const navigate = (newView: ViewState, eventData?: Event) => {
    if (eventData) {
      setSelectedEvent(eventData);
    }
    setView(newView);
    window.scrollTo(0, 0);
  };

  const handleAddEvent = (newEvent: Event) => {
    // In a real app, this would be a POST request to FastAPI
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (eventId: string) => {
    // In a real app, this would be a DELETE request to FastAPI
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    // In a real app, this would be a PUT/PATCH request to FastAPI
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const handleTicketSubmit = (request: Omit<TicketRequest, 'id' | 'timestamp'>) => {
    // In a real app, this would be a POST request to FastAPI
    const newTicket: TicketRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setTicketRequests(prev => [...prev, newTicket]);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={(e) => navigate('event_details', e)}
              />
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
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