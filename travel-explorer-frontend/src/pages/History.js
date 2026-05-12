import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postForm } from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await postForm("/register", form);
      navigate("/login");
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-3 text-center">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          className="form-control mb-3"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          className="form-control mb-3"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  );
}
