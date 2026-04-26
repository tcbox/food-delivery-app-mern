import useFetchUser from "../features/auth/hooks/useFetchUser";

export default function Register() {
  const { handleChange, handleRegister, formData, isLoading } = useFetchUser();

  return (
    <div className="">
      <div className="flex items-center justify-center h-screen w-full">
        <form
          onSubmit={handleRegister}
          className="flex flex-col space-y-3 text-sm font-medium bg-gray-100 rounded-2xl shadow-xl shadow-gray-900/50 p-8 w-96"
        >
          <h2 className="text-2xl font-bold text-center mb-2">Register</h2>

          <label htmlFor="username">USERNAME</label>
          <div className="w-full">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="h-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <label htmlFor="email">EMAIL</label>
          <div className="w-full">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="h-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <label htmlFor="password">PASSWORD</label>
          <div className="w-full">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="h-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
          <div className="w-full">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="h-10 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 mt-5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
