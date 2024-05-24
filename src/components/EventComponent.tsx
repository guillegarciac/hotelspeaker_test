import React, { useEffect, useState } from 'react';

const EventComponent: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);

  const setupEventSource = () => {
    console.log("Setting up event source...");
    const eventSource = new EventSource('/api/callback');

    eventSource.onopen = () => {
      console.log("Connection to server opened.");
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      console.log('New event from server:', event.data);
      const newMessage = JSON.parse(event.data);
      setMessages(messages => [...messages, newMessage]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource encountered an error:', error);
      setConnected(false);
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
      <p>Connection status: {connected ? 'Connected' : 'Disconnected, retrying...'}</p>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventComponent;
