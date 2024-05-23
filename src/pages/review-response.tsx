import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/ReviewResponse.module.css';

const ReviewResponse = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const [response, setResponse] = useState('Waiting for response...');

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!reviewId) return;

      try {
        const res = await fetch(`/api/checkCallback?reviewId=${reviewId}`);
        const data = await res.json();
        if (data.found) {
          setResponse(data.data.text);  // Adjust according to actual data structure
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error fetching callback data:", error);
        setResponse("Failed to connect for updates.");
        clearInterval(intervalId);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [reviewId]);

  return (
    <div>
      <h1>Review Response</h1>
      <p>{response}</p>
    </div>
  );
};

export default ReviewResponse;
