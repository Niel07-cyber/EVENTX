export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  description?: string;
  furtherInfo?: string;
  type?: 'Remote' | 'Onsite' | 'Hybrid';
}

export type Category = 'All Events' | 'Music' | 'Sports' | 'Arts & Theatre' | 'Festivals';

export interface TicketRequest {
  id: string; // Unique ID for the ticket
  eventId: string; // Foreign Key to Event
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  agreedToPolicy: boolean;
  timestamp: string;
}

export type ViewState = 'home' | 'event_details' | 'admin_login' | 'admin_dashboard' | 'admin_create_event' | 'admin_event_applicants';