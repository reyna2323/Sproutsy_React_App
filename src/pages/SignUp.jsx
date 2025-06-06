import React, { useState } from "react";
import { signUpUser } from "../utils/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signUpUser(email, password);
      navigate("/tutorial");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/leaves.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌱</div>
          <h1 className="text-xl font-bold text-green-900">Welcome!</h1>
          <p className="text-sm text-gray-600">Register yourself with us</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-4 py-2 bg-green-100 placeholder-green-900 text-green-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-4 py-2 bg-green-100 placeholder-green-900 text-green-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Repeat your password"
            className="w-full border rounded px-4 py-2 bg-green-100 placeholder-green-900 text-green-900"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded font-semibold"
          >
            Sign Up
          </button>

          <div className="text-sm text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <span className="text-green-800 underline" onClick={() => navigate("/login")}>
              Login
            </span>
          </div>
        </form>

        <div className="mt-6 border-t pt-4 text-center text-sm text-gray-500">
          Or continue with
          <div className="flex justify-center gap-4 mt-2">
            <button>🔵</button>
            <button>⚫</button>
            <button>🟢</button>
          </div>
        </div>
      </div>
    </div>
  );
}