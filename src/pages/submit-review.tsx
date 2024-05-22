import { useRouter } from 'next/router';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';

const SubmitReview: React.FC = () => {
  const router = useRouter();
  const { establishmentId } = router.query;
  const defaultReview = "Both the facilities and the staff were far above our expectations. The location of this hotel is strategic, in the center of the places you can visit... and if not, transportation was just a few steps away. The only downside was that a vegan breakfast was missing.";

  // State for the review, language, and response
  const [review, setReview] = useState<string>(defaultReview);
  const [language, setLanguage] = useState<string>('en');
  const [response, setResponse] = useState<string>('');
  const [reviewId, setReviewId] = useState<string>('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const timestamp = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]; // Current time in "YYYY-MM-DD hh:mm:ss" format
    const callbackUrl = `${window.location.origin}/api/reviewCallback`; // URL of the callback endpoint

    const reviewData = {
      establishment_id: establishmentId,
      language: language,
      date: timestamp, // ISO format for the date
      type: 'premium', // Assuming default type
      text: review, // Assuming 'text' is the correct field for review content
      callback_url: callbackUrl // Include the callback URL
    };

    try {
      const res = await fetch('/api/submitReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      setReviewId(data.id); // Save the review ID to fetch the response
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
        setResponse(data.responses[0]?.text || 'No response available'); // Assuming responses is an array
      } else {
        setTimeout(() => fetchReviewResponse(reviewId), 5000); // Retry after 5 seconds if not responded yet
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
    <div style={{ padding: '10px' }}>
      <h1>Submit a Review for Establishment ID: {establishmentId}</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={e => setReview(e.target.value)}
          style={{ width: '100%', height: '200px', marginBottom: '10px' }}
        />
        <div>
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            style={{ marginLeft: '10px' }}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px 0', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
          Submit Review
        </button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default SubmitReview;
