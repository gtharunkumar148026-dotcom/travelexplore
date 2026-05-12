import React, { useState } from "react";
import { postForm } from "../api/api";

export default function Feedback() {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postForm("/feedback", { message, rating });
      setStatus("Feedback submitted successfully!");
      setMessage("");
    } catch {
      setStatus("Failed to send feedback");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-3 text-center">Submit Feedback</h2>
      {status && <div className="alert alert-info">{status}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control mb-3"
          placeholder="Write your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <label className="form-label">Rating: {rating}⭐</label>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          className="form-range mb-3"
          onChange={(e) => setRating(e.target.value)}
        />
        <button type="submit" className="btn btn-success w-100">
          Submit
        </button>
      </form>
    </div>
  );
}
