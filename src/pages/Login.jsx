import React, { useState } from "react";
import { loginUser } from "../utils/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/leaves.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌿</div>
          <h1 className="text-xl font-bold text-green-900">Welcome Back!</h1>
          <p className="text-sm text-gray-600">We’re so excited to see you again</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded font-semibold"
          >
            Login
          </button>

          <div className="text-sm text-center text-gray-600 mt-2">
            Forgot your password? <span className="text-green-800 underline">Reset</span>
          </div>

          <div className="text-sm text-center text-gray-600 mt-2">
            Don’t have an account?{" "}
            <span className="text-green-800 underline" onClick={() => navigate("/signup")}>
              Register
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}