// components/EventComponent.tsx
import React, { useEffect, useState } from 'react';

interface ServerEvent {
  message: string;
}

const EventComponent: React.FC = () => {
  const [messages, setMessages] = useState<ServerEvent[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/callback');

    eventSource.onmessage = function (event) {
      console.log('New event from server:', event.data);
      const newEvent: ServerEvent = JSON.parse(event.data);
      setMessages(prev => [...prev, newEvent]);
    };

    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h1>Server Events</h1>
      {messages.map((msg, index) => (
        <div key={index}>{JSON.stringify(msg)}</div>
      ))}
    </div>
  );
};

export default EventComponent;
