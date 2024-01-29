import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.css";
import Signup from "./auth/Signup.jsx";
import Signin from "./auth/Signin.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from './profile.jsx'
import Chat from './chat.jsx'
import MainChat from "./mainChat.jsx";
import MyStore from "./myStore.jsx";
import SellItem from "./sellItem.jsx";
import ItemInfo from "./iteminfo.jsx";
import CategoryItems from "./categoryItems.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

      <AuthProvider>
        <BrowserRouter >
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/mainchat' element={<MainChat />} />
          <Route path='/mystore' element={<MyStore />} />
          <Route path='/sellitem' element={<SellItem />} />
          <Route path='/iteminfo' element={<ItemInfo />} />
          <Route path='/categoryItems' element={<CategoryItems />} />
        </Routes>
        </BrowserRouter>
      </AuthProvider>
 
  </React.StrictMode>
);
