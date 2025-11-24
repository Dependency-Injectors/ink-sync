import { Link, useNavigate } from "react-router";
import { useCurrentUser } from "../lib/useCurrentUser";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const Register = () => {
  const { setUser } = useCurrentUser();

  const navigate = useNavigate();
  const handleRegister = async (formData: FormData) => {
    try {
      const email = formData.get("email");
      const password = formData.get("password");
      const res = await axiosInstance.post("/register", { email, password });
      const data = res.data;
      setUser({ email: data.email });
      toast.success("Registered successfully");
      navigate("/");
    } catch (error) {
      toast.error("Request failed. Please try again.");
      console.error("Registration error:", error);
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
              placeholder="example@gmail.com"
              className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petrol-500"
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
              className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petrol-500"
            />
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
          className="mt-4 p-3 rounded-md bg-petrol-500 text-white font-semibold hover:bg-petrol-600 focus:outline-none focus:ring-2 focus:ring-petrol-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;
