import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import Auth from './pages/Auth'

import HomeUser from './pages/User/Home'
import DetailProduct from './pages/User/DetailProduct'
import ComplainUser from './pages/User/ComplainUser'
import Profile from './pages/User/Profile'
import EditProfile from './pages/User/EditProfile'

import Product from './pages/Admin/Product'
import AddProduct from './pages/Admin/AddProduct'
import EditProduct from './pages/Admin/EditProduct'
import Category from './pages/Admin/Category'
import AddCategory from './pages/Admin/AddCategory'
import EditCategory from './pages/Admin/EditCategory'
import ComplainAdmin from './pages/Admin/ComplainAdmin'

import PrivateRoute from './components/route/PrivateRoute'

import { UserContext } from './context/userContext'
// Init token on axios every time the app is refreshed
import { API, setAuthToken } from "./config/api"

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  let navigate = useNavigate()
  // Init user context
  const [state, dispatch] = useContext(UserContext)
  // console.clear()
  // console.log(state)

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    // Redirect Auth
    if (state.isLogin === false) {
      navigate('/')
    } else {
      if (state.user.status === 'admin') {
        navigate('/complain-admin')
      } else if (state.user.status === 'customer') {
        navigate('/home')
      }
    }
  }, [state])

  const checkAuth = async () => {
    try {
      const response = await API.get('/check-auth')
      // console.log('response:', response);

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        })
      }
      // Get user data
      let payload = response.data.data.user
      // console.log('payload:', payload);
      // Get token from local storage
      payload.token = localStorage.token

      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <Routes>
      {/* Login-Register */}
      <Route path="/" element={<Auth />} />

      {/* User Page */}
      <Route path="/home" element={<HomeUser />} />
      <Route path="/detail-product/:id" element={<DetailProduct />} />
      <Route path="/complain-user" element={<ComplainUser />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      {/* Admin Page */}

      <Route element={<PrivateRoute />} >
        <Route path="/product" element={<Product />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/category" element={<Category />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/edit-category/:id" element={<EditCategory />} />
        <Route path="/complain-admin" element={<ComplainAdmin />} />
      </Route>
    </Routes>
  )
}

export default App