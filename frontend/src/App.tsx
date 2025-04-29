import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

import ProtectedRoute from './Routes/ProtectedRoute';

import './App.css'
import RandomTest from './pages/RandomTest';
import AdaptiveTest from './pages/AdaptiveTest';
import PrivacyPage from './pages/PrivacyPage';

// When the user tries to logout,
function Logout() {
  localStorage.clear();
  localStorage.setItem("successMessage", "Successfully logged out!") // To indicate that the user has logged out successfully
  return <Navigate to="/login"/>
}


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout/>}>
        <Route index element={
            <RandomTest/>
        }></Route>

        <Route path="/adaptive" element={
          <ProtectedRoute>
            <AdaptiveTest/>  
          </ProtectedRoute>
        }></Route>

        <Route path="/login" element={<Login/>}></Route>
        <Route path="/logout" element={<Logout/>} ></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/privacy-policy" element={<PrivacyPage/>}></Route>
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile/>  
          </ProtectedRoute>
        }></Route>

        <Route path="*" element={<NotFound />}></Route>
      </Route>
    )
  )
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App;
