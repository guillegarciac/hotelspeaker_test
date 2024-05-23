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
        if (res.ok) {
          // Ensure that the data structure is correct and data exists
          if (data.responses && data.responses.length > 0) {
            setResponse(data.responses[0].text);
          } else {
            setResponse('No response available.');
          }
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (error) {
        console.error("Error fetching review response:", error);
        setResponse("Failed to connect for updates.");
      }
    };

    if (reviewId) {
      fetchData();
    }
  }, [reviewId]);  // Dependency array ensures useEffect is called when reviewId changes

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
