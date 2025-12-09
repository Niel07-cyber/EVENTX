import React from 'react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div 
      onClick={() => onClick(event)}
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
    >
      <div className="relative overflow-hidden h-44">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
          {event.type || 'Onsite'}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-1 text-lg group-hover:text-primary transition-colors">{event.title}</h3>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{event.date} • {event.time}</p>
        <p className="text-sm text-gray-600 mb-4 flex items-center gap-1">
           <span className="truncate">{event.location}</span>
        </p>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium">From</span>
          <span className="text-xl font-bold text-primary">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;