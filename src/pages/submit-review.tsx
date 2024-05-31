import { useRouter } from "next/router";
import { useState, FormEvent } from "react";
import Head from "next/head";
import styles from "../styles/SubmitReview.module.css";
import { TailSpin } from "react-loader-spinner"; // Import the loader
import Typewriter from "typewriter-effect"; // Import Typewriter component

// Import React, useRouter, useState, FormEvent from 'react'
// Import Head from 'next/head'
// Import styles, TailSpin, and TypewriterEffect as shown previously

const SubmitReview: React.FC = () => {
  const router = useRouter();
  const { establishmentId } = router.query;
  const defaultReview =
    "Aside from this hotel's rooms being a bit dated, it has a serious bug problem...";
  const [review, setReview] = useState<string>(defaultReview);
  const [language, setLanguage] = useState<string>("en");
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const timestamp =
      new Date().toISOString().split("T")[0] +
      " " +
      new Date().toTimeString().split(" ")[0];

    const reviewData = {
      establishment_id: establishmentId,
      language: language,
      date: timestamp,
      type: "instant",
      text: review,
    };

    try {
      const res = await fetch("/api/submitReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }
      setResponses(data.responses);
    } catch (error) {
      console.error("Error submitting review:", error);
      setResponses([
        {
          opening: "Error",
          body: "Failed to submit review",
          closing: "Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Submit Review</title>
        <meta
          name="description"
          content="Submit a review for an establishment"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1 className={styles.heading}>
        Submit a Review for Establishment ID: {establishmentId}
      </h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className={styles.textarea}
        />
        <div>
          <label htmlFor="language-select" className={styles.label}>
            Language:
          </label>
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
        <button type="submit" className={styles.button} disabled={loading}>
          Submit Review
        </button>
      </form>
      {loading ? (
        <div className={styles.loader}>
          <TailSpin color="#00BFFF" height={50} width={50} />
          <p className={styles.loaderText}>
            Analyzing the review
            <span className={styles.dots}>
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .pauseFor(1000) // Optional: Delay before starting
                    .typeString(".")
                    .pauseFor(500)
                    .typeString(".")
                    .pauseFor(500)
                    .typeString(".")
                    .pauseFor(500)
                    .deleteAll(10)
                    .start();
                }}
                options={{
                  loop: true,
                  delay: 75,
                  deleteSpeed: 10,
                }}
              />
            </span>
          </p>
        </div>
      ) : (
        responses.map((res, index) => (
          <div key={index} className={styles.response}>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(res.opening)
                  .pauseFor(500)
                  .typeString("<br><br>" + res.body)
                  .pauseFor(500)
                  .typeString("<br><br>" + res.closing)
                  .start();
              }}
              options={{
                delay: 10, // Faster typing speed
                cursor: "", // Hide the cursor if you don't need it
                wrapperClassName: styles.typewriterText, // Custom CSS class for styling
              }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default SubmitReview;
