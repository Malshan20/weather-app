import { useState } from 'react';

export function useToast() {
  const [message, setMessage] = useState("");

  const toast = ({ title, description, variant }: any) => {
    setMessage(`${title}: ${description}`);
    // Add logic for variants or other styling as needed
  };

  return { toast };
}
