import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import UserToDo from "./components/UserToDo";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserToDo />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
