import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
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
  const { reviewId } = router.query;
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldPoll, setShouldPoll] = useState(true);

  const fetchData = async () => {
    const res = await fetch('/api/callback');
    if (res.ok) {
      const json = await res.json();
      const callbackData = JSON.parse(Object.keys(json)[0]);
      const data: Response = {
        review_id: callbackData.review_id,
        responses: callbackData.responses,
      };
  
      if (data && reviewId && data.review_id === reviewId) {
        setShouldPoll(false);
        setResponse(data);
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchData();
    if (shouldPoll) {
      const pollingInterval = setInterval(fetchData, 10000);
      return () => clearInterval(pollingInterval);
    }
  }, [shouldPoll]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Review Responses</title>
        <meta name="description" content="Review responses for a submitted review" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1 className={styles.heading}>Review Responses for Review ID: {reviewId}</h1>
      {loading ? (
        <div>
          <div className={styles.loadingMessage}>We are experiencing high volumes. Please wait without refreshing the page...</div>
          <div className={styles.loader}></div>
        </div>
      ) : response ? (
        response.responses.map((res, index) => (
          <div key={index} className={styles.key}>
            <h2 className={styles.subheading}>{res.opening}</h2>
            <p className={styles.paragraph}>{res.body}</p>
            <h3 className={styles.smallHeading}>{res.closing}</h3>
          </div>
        ))
      ) : (
        <p>Loading responses...</p>
      )}
    </div>
  );
};

export default ReviewResponse;
