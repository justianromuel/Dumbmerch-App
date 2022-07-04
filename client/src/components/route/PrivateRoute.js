import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext'

const PrivateRoute = () => {
    const [state, dispatch] = useContext(UserContext)
    let isLogin = state.isLogin

    return isLogin === true ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRoute