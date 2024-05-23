// ReviewResponse.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/ReviewResponse.module.css';

const ReviewResponse: React.FC = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const [response, setResponse] = useState<string>('Waiting for response...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/getReviewResponse?reviewId=${reviewId}`);
        const data = await res.json();
        if (res.ok && data.data.responses && data.data.responses.length > 0) {
          setResponse(data.data.responses[0]?.text || 'No response available');
        } else {
          setResponse('No updates available yet.');
        }
      } catch (error) {
        console.error("Error fetching review response:", error);
        setResponse("Failed to connect for updates.");
      }
    };

    fetchData();
  }, [reviewId]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Review Response</title>
        <meta name="description" content="View the response for your submitted review" />
      </Head>
      <h1 className={styles.heading}>Review Response</h1>
      <p>{response}</p>
    </div>
  );
};

export default ReviewResponse;
