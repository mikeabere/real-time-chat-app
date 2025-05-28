import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/chatpage");
    } catch (err) {
      alert(err.response.data.msg || "Login failed");
    }
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg flex flex-col"
        >
          <h1 className="text-2xl font-semibold text-center">Log in</h1>
          <input
            className="border border-solid rounded-sm p-2 hover:bg-indigo-50"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            className="border border-solid rounded-sm p-2 hover:bg-indigo-50"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary w-full cursor-pointer">
            Login
          </button>

          <p className="text-sm text-center">
            No account?{" "}
            <Link className="text-indigo-600 hover:underline" to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Login;
