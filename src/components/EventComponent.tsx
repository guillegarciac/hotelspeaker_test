import React, { useEffect, useState } from 'react';

const EventComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const setupEventSource = () => {
    console.log("Setting up event source...");
    const eventSource = new EventSource('/api/callback');

    eventSource.onopen = function() {
      console.log("Connection to server opened.");
    };

    eventSource.onmessage = function(event) {
      console.log('New event from server:', event.data);
      const newMessage = JSON.parse(event.data); // Parse the JSON data received from the server
      setMessages(currentMessages => [...currentMessages, newMessage]); // Update state to display message
    };

    eventSource.onerror = function(error) {
      console.error('EventSource encountered an error:', error);
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log("EventSource closed by the server");
      }
      eventSource.close();
      setTimeout(setupEventSource, 5000);  // Retry after 5 seconds
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
