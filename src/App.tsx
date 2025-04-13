import { useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import HomePage from "./Pages/HomePage/HomePage";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <HomePage />
    </div>
  );
}

export default App;
