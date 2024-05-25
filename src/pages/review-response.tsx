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

  const fetchData = async () => {
    const res = await fetch('/api/callback');
    if (res.ok) {
      const data: Response = await res.json();
      setResponse(data);

      // Check if the received review_id matches the one from the query parameter
      if (data && reviewId && data.review_id === reviewId) {
        setLoading(false); // Stop loading if review_id matches
      }
    }
  };

  useEffect(() => {
    fetchData();

    // Polling every 10 seconds
    const pollingInterval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, []); // Run once when the component mounts

  return (
    <div className={styles.container}>
      {loading ? ( // Show loader if loading state is true
        <div className={styles.loader}></div>
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
