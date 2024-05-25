import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/ReviewResponse.module.css';

interface Response {
  review_id: string;
  responses: {
    [key: string]: {
      opening: string;
      body: string;
      closing: string;
    };
  };
}

const ReviewResponse: React.FC = () => {
  const router = useRouter();
  const { reviewId } = router.query; // Get reviewId from router query
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true); // State variable to track loading state
  const [shouldPoll, setShouldPoll] = useState(true); // State variable to track whether polling should continue

  const fetchData = async () => {
    const res = await fetch('/api/callback');
    if (res.ok) {
      const data: Response = await res.json();
      console.log('Received response:', data);
    
      // Check if the received review_id matches the one from the query parameter
      console.log('Review ID from query:', reviewId);
      console.log('Review ID from response:', data.review_id);
      if (data && reviewId && data.review_id === reviewId) {
        console.log('Review ID matches. Stopping polling.');
        setShouldPoll(false); // Stop polling if review_id matches
        setResponse(data); // Set the response in the state
        setLoading(false); // Set loading to false once data is fetched
      } else {
        console.log('Review ID does not match. Continuing polling.');
      }
    }
  };
  
  // Inside the useEffect hook
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
    <div className={styles.container}>
      {loading ? ( // Show loader if loading state is true
        <div>
          <div>We are experiencing high volumes. Please wait without refreshing the page...</div>
          <div className={styles.loader}></div>
        </div>
      ) : response ? (
        <div>
          <h1>Review Responses</h1>
          <p>{response.review_id}</p>
          {Object.entries(response.responses).map(([key, res]) => (
            <div key={key}>
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
