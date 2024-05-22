import { useState, ChangeEvent, FormEvent } from "react";
import Head from "next/head";

// Define the structure for the establishment details
interface EstablishmentDetails {
  type: string;
  custom_id: string;
  name: string;
  address: string;
  zipcode: string;
  city: string;
  state_or_region: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  response_tone: string;
  preferred_language: string;
  active: boolean;
  signature_name: string;
  signature_title: string;
  brand_guidelines: string;
}

export default function CreateEstablishment() {
  // Initial values set for the form fields
  const [establishmentDetails, setEstablishmentDetails] = useState<EstablishmentDetails>({
    type: "hotel",
    custom_id: "hotel123",
    name: "Grand Plaza Hotel",
    address: "1234 Boulevard St",
    zipcode: "90210",
    city: "Beverly Hills",
    state_or_region: "CA",
    country: "USA",
    phone: "310-555-1234",
    email: "info@grandplazahotel.com",
    website: "https://www.grandplazahotel.com",
    response_tone: "informal",
    preferred_language: "en",
    active: true,
    signature_name: "John Doe",
    signature_title: "General Manager",
    brand_guidelines: "The brand tone should be friendly and welcoming. Emphasize luxury and comfort."
  });

  const [establishmentId, setEstablishmentId] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  // Function to handle changes in the form inputs
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const target = event.target as HTMLInputElement; // Type assertion here
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
  
    setEstablishmentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to create an establishment
  const createEstablishment = async () => {
    try {
      const response = await fetch('/api/createEstablishment', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(establishmentDetails),
      });

      if (!response.ok) {
        throw new Error(`Failed to create establishment: ${await response.text()}`);
      }

      const data = await response.json();
      setEstablishmentId(data.id);  // Save the establishment ID for future operations
    } catch (error) {
      console.error("Error creating establishment:", error);
    }
  };

  // Function to handle form submission for reviews
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/submitReview', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          establishmentId,  // Include the establishment ID when submitting the review
          review
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${await response.text()}`);
      }

      const data = await response.json();
      setResponse(data.response);  // Display the response from the API
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Review Submission App</title>
        <meta name="description" content="Submit a review and get a response" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1>Create Establishment</h1>
        <form>
          {/* Render inputs for all establishment details */}
          {Object.entries(establishmentDetails).map(([key, value]) => {
            if (key === "active") {
              return (
                <label key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                  <input
                    type="checkbox"
                    name={key}
                    checked={value as unknown as boolean}
                    onChange={handleInputChange}
                  />
                </label>
              );
            }
            return (
              <input
                key={key}
                type={key === "email" ? "email" : key === "website" ? "url" : "text"}
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value as string}
                onChange={handleInputChange}
              />
            );
          })}
          <button type="button" onClick={createEstablishment}>Create Establishment</button>
        </form>
      </main>
    </>
  );
}
