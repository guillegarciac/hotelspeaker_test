// components/getReviewResponse.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const GetReviewResponse = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (reviewId) {
      fetch(`/api/getReviewResponse?reviewId=${reviewId}`)
        .then(res => res.json())
        .then(data => setResponse(data))
        .catch(err => console.error('Failed to fetch review response:', err));
    }
  }, [reviewId]);

  return (
    <div>
      {response ? (
        <div>
          <h1>Review Response</h1>
          <p>{(response as { body: string }).body}</p>
        </div>
      ) : (
        <p>Loading response...</p>
      )}
    </div>
  );
};

export default GetReviewResponse;
