import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useState } from "react";
import { AxiosError } from "axios";

const Register = () => {
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();
  const handleRegister = async (formData: FormData) => {
    setPending(true);
    try {
      const email = formData.get("email");
      const password = formData.get("password");
      await axiosInstance.post("/register", { email, password });
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;
        if (status === 422) {
          toast.error(
            `Password does not meet complexity requirements. It must be 8-40 characters
             long and include uppercase letters,
             lowercase letters, numbers, and special characters.`,
          );
        } else if (status === 409) {
          toast.error("User already exists. Please log in instead.");
        } else {
          toast.error("Server error. Please try again later.");
        }
      } else {
        toast.error("Request failed. Please try again.");
      }
      console.error("Registration error:", String(error));
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-linear-to-br from-gray-950 to-gray-800">
      <form
        action={handleRegister}
        className="grid gap-6 bg-gray-800 p-8 rounded-lg shadow shadow-petrol-800 w-full max-w-md"
      >
        <p className="text-lg font-semibold text-petrol-500">
          Please enter your email and password to register.
        </p>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="example@gmail.com"
              disabled={pending}
              className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petrol-500 disabled:opacity-50 invalid:ring-2 invalid:ring-red-500 focus:invalid:ring-red-500"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              minLength={8}
              maxLength={64}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$"
              required
              disabled={pending}
              className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petrol-500 disabled:opacity-50 invalid:ring-2 invalid:ring-red-500 focus:invalid:ring-red-500"
            />
            <p className="text-xs text-gray-400">
              8-64 characters with uppercase, lowercase, numbers, and special
              characters
            </p>
          </div>
        </div>
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-petrol-400 hover:underline">
            Log in here
          </Link>
        </p>
        <button
          type="submit"
          className="mt-4 p-3 rounded-md bg-petrol-500 text-white font-semibold hover:bg-petrol-600 focus:outline-none focus:ring-2 focus:ring-petrol-500 disabled:opacity-50"
          disabled={pending}
        >
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;
