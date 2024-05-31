import { useRouter } from 'next/router';
import { useState, FormEvent, ChangeEvent } from 'react';
import Head from 'next/head';
import styles from '../styles/SubmitReview.module.css';

const SubmitReview: React.FC = () => {
  const router = useRouter();
  const { establishmentId } = router.query;
  const defaultReview = "Aside from this hotel's rooms being a bit dated it has a serious bug problem in the guest rooms. Our first night we noticed a large drain gnat above the bathroom door I noted but didn't make a big deal about it. Later on we started to notice fruit flies and other peski flying insects that became a nuisance but dealt with it for the evening. The following day my daughter found an insect crawling in her clothes that she had stored in the hotels dresser. We filed a complaint with the manager on duty, (Isma) and had a front desk clerk move us to a different room that unfortunately had the same issues. Isma promised she would follow up with me on her finding and a resolution to my complaint but never did. Issues we encountered included bugs in both the bathroom and guest room furniture, a dirty towel and subpar room cleaning services. Staff at the hotel was friendly but we were not happy with the services provided. I found it to be unprofessional the Hilton London Metropole didn't offer a resolution for our ongoing issues. They did however write an apology note and give me a bowl of fruit and juice!?";

  const [review, setReview] = useState<string>(defaultReview);
  const [language, setLanguage] = useState<string>('en');
  const [response, setResponse] = useState<string>('');
  const [reviewId, setReviewId] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0];
  
    const callbackUrl = `https://hotelspeaker.vercel.app/api/callback`;
  
    try {
      // Clear callback endpoint before submitting new review
      await fetch('/api/callback', {
        method: 'DELETE',
      });
      console.log('Callback endpoint cleared successfully');
  
      const reviewData = {
        establishment_id: establishmentId,
        language: language,
        date: timestamp,
        type: 'instant',
        text: review,
        callback_url: callbackUrl
      };
  
      const res = await fetch('/api/submitReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }
  
      setReviewId(data.id);
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
