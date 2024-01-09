import React, {useState} from "react"
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProfilePic from "./pages/ProfilePic";
import AuthContext from "./context/AuthContext";
import Chat1 from "./pages/Chat1";

function App() {

  const[IsAuth,setIsAuth] = useState(false);
  const[user,setUser] = useState({});
  return (

    <AuthContext.Provider value = {{user,setUser,IsAuth,setIsAuth}}>
    <BrowserRouter>
     <Routes>
      <Route path="/renhbhvbvgister" element={<Register/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/profilepic" element={<ProfilePic/>}></Route>
      <Route path="/chat1" element={<Chat1/>}></Route>
     </Routes>
    </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
