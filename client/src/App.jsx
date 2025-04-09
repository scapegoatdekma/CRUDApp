import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Reg from "./pages/Reg/Reg";
import { AuthContext } from "./context/AuthContext/AuthContext";
import TicketCreate from "./components/TicketCreate/TicketCreate";
import TicketPage from "./pages/TicketPage/TicketPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import TicketDetails from "./pages/TicketPage/TicketDetails";
import TicketEdit from "./pages/TicketPage/TicketEdit";
import Profile from "./pages/Profile/Profile";

function App() {
  // const { token } = 1;
  const { token } = useContext(AuthContext);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/auth" />} />
        <Route
          path="/tickets"
          element={token ? <TicketPage /> : <Navigate to="/auth" />}
        />
         <Route
          path="/tickets/:id"
          element={
              <TicketDetails />
          }
        />
         <Route
          path="/tickets/:id/edit"
          element={
  
              <TicketEdit />

          }
        />
        <Route
          path="/ticket/create"
          element={token ? <TicketCreate /> : <Navigate to="/auth" />}
        />
          <Route
          path="/chat"
          element={token ? <ChatPage /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={token ? <Navigate to="/" /> : <Auth />} />
        <Route path="/reg" element={token ? <Navigate to="/" /> : <Reg />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
