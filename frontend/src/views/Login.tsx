import { redirect } from "react-router";

const Login = () => {
  const handleLogin = async (formData: FormData) => {
    try {
      const email = formData.get("email");
      const password = formData.get("password");
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        redirect("/");
        return;
      } else {
        alert("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <form
        action={handleLogin}
        className="grid gap-6 bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <p className="text-lg font-semibold text-petrol-500">
          Please enter your email and password to log in.
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
        <button
          type="submit"
          className="mt-4 p-3 rounded-md bg-petrol-500 text-white font-semibold hover:bg-petrol-600 focus:outline-none focus:ring-2 focus:ring-petrol-500"
        >
          Log In
        </button>
      </form>
    </div>
  );
};
export default Login;
