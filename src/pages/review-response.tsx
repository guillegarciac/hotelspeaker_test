// src/pages/review-response.tsx
import { useEffect, useState } from 'react';

interface Response {
  review_id: string;
  responses: Array<{
    opening: string;
    body: string;
    closing: string;
  }>;
}

const ReviewResponse: React.FC = () => {
  const [response, setResponse] = useState<Response | null>(null);
  const [shouldPoll, setShouldPoll] = useState(true); 

  const fetchData = async () => {
    const res = await fetch('/api/callback');
    if (res.ok) {
      const data: Response = await res.json();
      setResponse(data);
      setShouldPoll(false);
    }
  };

  useEffect(() => {
    fetchData(); 

    // Polling every 10 seconds if shouldPoll is true
    if (shouldPoll) {
      const pollingInterval = setInterval(fetchData, 10000);

      return () => {
        clearInterval(pollingInterval);  
      };
    }
  }, [shouldPoll]); 

  return (
    <div>
      {response ? (
        <div>
          <h1>Review Responses</h1>
          <p>{response.review_id}</p>
          {response.responses.map((res, index) => (
            <div key={index}>
              <h2>{res.opening}</h2>
              <p>{res.body}</p>
              <h3>{res.closing}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading responses...</p>
      )}
    </div>
  );
};

export default ReviewResponse;
