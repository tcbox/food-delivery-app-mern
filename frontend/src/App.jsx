import Navbar from "./components/NavBar.jsx";
import FetchUser from "./features/auth/hooks/useFetchUser.jsx";
function App() {
  return (
    <div className="bg-gray-950">
      <Navbar />
      <FetchUser />
    </div>
  );
}

export default App;
