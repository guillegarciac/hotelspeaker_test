import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/ReviewResponse.module.css';

const ReviewResponse: React.FC = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const [response, setResponse] = useState<string>('Waiting for response...');

  useEffect(() => {
    const eventSourceUrl = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/reviewResponseStream${reviewId ? `?reviewId=${reviewId}` : ''}`;
    console.log("EventSource URL:", eventSourceUrl);
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data.review_id === reviewId && data.responses.length > 0) {
        setResponse(data.responses[0]?.text || 'No response available');
        eventSource.close();
      }
    };

    eventSource.onerror = function(error) {
      console.error("EventSource failed:", error);
      setResponse("Failed to connect for updates.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [reviewId]);  // Dependency on reviewId to reinitialize if it changes

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