import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/ReviewResponse.module.css';

interface Response {
  review_id: string;
  responses: Array<{
    opening: string;
    body: string;
    closing: string;
  }>;
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
      const rawData: string = await res.text(); // Get the raw response data as a string
      const dataStartIndex = rawData.indexOf('{'); // Find the starting index of the JSON object
      const jsonData = JSON.parse(rawData.substring(dataStartIndex)); // Extract and parse the JSON object
      
      console.log('Received response:', jsonData);
    
      // Check if the received review_id matches the one from the query parameter
      console.log('Review ID from query:', reviewId);
      console.log('Review ID from response:', jsonData.review_id);
      if (jsonData && reviewId && jsonData.review_id === reviewId) {
        console.log('Review ID matches. Stopping polling.');
        setShouldPoll(false); // Stop polling if review_id matches
        setResponse(jsonData); // Set the response in the state
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
