import React from "react";

export default function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="fw-bold">Welcome to Travel Explorer 🌍</h1>
      <p className="lead mt-3">
        Discover destinations, share feedback, and connect with travel lovers!
      </p>
      <img
        src="https://cdn.pixabay.com/photo/2016/11/29/09/08/adventure-1868817_960_720.jpg"
        className="img-fluid rounded mt-4 shadow"
        alt="Travel"
      />
    </div>
  );
}
