// Assuming this file is EventComponent.tsx

import React, { useEffect, useState } from 'react';

const EventComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  // Define a function to setup the SSE connection
  const setupEventSource = () => {
    const eventSource = new EventSource('/api/callback');

    eventSource.onmessage = function(event) {
      console.log('New event from server:', event.data);
      const newMessage = JSON.parse(event.data);
      setMessages(prev => [...prev, newMessage]);
    };

    eventSource.onerror = function(error) {
      console.error('EventSource encountered an error:', error);
      eventSource.close();
      // Retry connection after a delay
      setTimeout(setupEventSource, 5000); // Retry after 5 seconds
    };

    return eventSource;
  };

  useEffect(() => {
    const es = setupEventSource();
    return () => {
      es.close(); // Clean up the event source when the component unmounts
    };
  }, []);

  return (
    <div>
      <h1>Server Events</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventComponent;
