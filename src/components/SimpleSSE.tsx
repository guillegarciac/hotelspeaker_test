// components/SimpleSSE.tsx

import React, { useEffect, useState } from 'react';

interface Message {
    message: string;
}

const SimpleSSE: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const eventSource = new EventSource('/api/simple-sse');

        eventSource.onmessage = (event) => {
            console.log('Received event:', event.data);
            const newMessage: Message = JSON.parse(event.data);
            setMessages(prev => [...prev, newMessage]);
        };

        eventSource.onerror = (event) => {
            console.error('SSE error:', event);
            eventSource.close();
        };

        return () => {
            console.log('Closing event source');
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h1>Received Messages</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default SimpleSSE;
