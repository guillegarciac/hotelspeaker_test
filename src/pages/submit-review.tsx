import { useRouter } from 'next/router';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/SubmitReview.module.css';

const SubmitReview: React.FC = () => {
  const router = useRouter();
  const { establishmentId } = router.query;
  const defaultReview = "Both the facilities and the staff were far above our expectations. The location of this hotel is strategic, in the center of the places you can visit... and if not, transportation was just a few steps away. The only downside was that a vegan breakfast was missing.";

  const [review, setReview] = useState<string>(defaultReview);
  const [language, setLanguage] = useState<string>('en');
  const [response, setResponse] = useState<string>('');
  const [reviewId, setReviewId] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0];
    const callbackUrl = `${window.location.origin}/api/reviewCallback`;

    const reviewData = {
      establishment_id: establishmentId,
      language: language,
      date: timestamp,
      type: 'premium',
      text: review,
      callback_url: callbackUrl
    };

    try {
      const res = await fetch('/api/submitReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      setReviewId(data.id);
    } catch (error) {
      console.error("Error submitting review:", error);
      setResponse("Failed to submit review.");
    }
  };

  const fetchReviewResponse = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/getReviewResponse?id=${reviewId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.responses.length > 0) {
        setResponse(data.responses[0]?.text || 'No response available');
      } else {
        setTimeout(() => fetchReviewResponse(reviewId), 5000);
      }
    } catch (error) {
      console.error("Error fetching review response:", error);
      setResponse("Failed to fetch review response.");
    }
  };

  useEffect(() => {
    if (reviewId) {
      fetchReviewResponse(reviewId);
    }
  }, [reviewId]);

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Submit Review</title>
        <meta name="description" content="Submit a review for an establishment" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1 className={styles.heading}>Submit a Review for Establishment ID: {establishmentId}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          className={styles.textarea}
        />
        <div>
          <label htmlFor="language-select" className={styles.label}>Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className={styles.select}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <button type="submit" className={styles.button}>Submit Review</button>
      </form>
      {response && <p className={styles.response}>{response}</p>}
    </div>
  );
};

export default SubmitReview;
