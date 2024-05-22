export interface Establishment {
  id: string;
  name: string;
  // Add other relevant fields as defined in the API documentation
}

export interface EstablishmentDetails {
  type: string;
  custom_id: string; // Your own unique identifier if needed
  name: string;
  address: string;
  zipcode: string;
  city: string;
  state_or_region: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  response_tone: "informal" | "formal" | "very_formal"; // Enum type for predefined values
  preferred_language: string; // ISO code for language, e.g., 'en', 'es'
  active: boolean;
  signature_name: string; // Could be used for emails or documents
  signature_title: string; // Job title or role in the establishment
  brand_guidelines: string; // Description or link to a document with branding guidelines
}