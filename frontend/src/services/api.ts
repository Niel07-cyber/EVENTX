import type { Event, TicketRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error || 'Invalid credentials';
      throw new Error(message);
    }

    return data;
  }
};

// Event API calls
export const eventAPI = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  // Get event by ID
  getById: async (id: string): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${id}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
  },

  // Create new event
  create: async (event: Event): Promise<Event> => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  // Update event
  update: async (id: string, event: Event): Promise<Event> => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
  },
};

// Ticket API calls
export const ticketAPI = {
  // Get all ticket requests
  getAll: async (): Promise<TicketRequest[]> => {
    const response = await fetch(`${API_URL}/tickets`);
    if (!response.ok) throw new Error('Failed to fetch ticket requests');
    return response.json();
  },

  // Get ticket requests by event ID
  getByEvent: async (eventId: string): Promise<TicketRequest[]> => {
    const response = await fetch(`${API_URL}/tickets/event/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch ticket requests');
    return response.json();
  },

  // Get ticket request count by event ID
  getCountByEvent: async (eventId: string): Promise<number> => {
    const response = await fetch(`${API_URL}/tickets/event/${eventId}/count`);
    if (!response.ok) throw new Error('Failed to fetch ticket count');
    const data = await response.json();
    return data.count;
  },

  // Create new ticket request
  create: async (ticket: Omit<TicketRequest, 'timestamp'>): Promise<TicketRequest> => {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket),
    });
    if (!response.ok) throw new Error('Failed to create ticket request');
    return response.json();
  },
};
