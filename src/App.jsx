import { Routes, Route } from "react-router-dom";
import ChatsPage from "./pages/ChatsPage";
import HomePage from "./pages/HomePage";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatsPage />} />
      </Routes>
    </>
  );
}

export default App;
