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

    const reviewData = {
        establishment_id: establishmentId,
        language: language,
        date: timestamp,
        type: 'auto',
        text: review,
        callback_url: ''  // Set initially empty
    };

    try {
        const res = await fetch('/api/submitReview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to submit review');

        // Update reviewId and set the callback URL after successful submission
        setReviewId(data.id);
        const callbackUrl = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/reviewResponseStream?reviewId=${data.id}`;
        console.log("Callback URL:", callbackUrl);

        router.push(`/review-response?reviewId=${data.id}`);
    } catch (error) {
        console.error("Error submitting review:", error);
        setResponse("Failed to submit review.");
    }
};


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
