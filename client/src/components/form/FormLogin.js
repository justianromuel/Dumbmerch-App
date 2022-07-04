import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { Alert } from 'react-bootstrap'

import { UserContext } from '../../context/userContext'
import { API } from '../../config/api'

const FormLogin = () => {
    const title = 'Login'
    document.title = 'DumbMerch | ' + title

    let navigate = useNavigate()

    const [state, dispatch] = useContext(UserContext)
    const [message, setMessage] = useState(null)
    // Create variabel for store data with useState here ...
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const { email, password } = form

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // Create function for handle insert data process with useMutation here ...
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            // Configuration Content-type
            const config = {
                headers: {
                    'Content-type': 'application/json',
                }
            }

            // Data body
            let body = JSON.stringify(form)

            // Insert data user to database
            const response = await API.post('/login', body, config)
            // console.log(response)

            // Checking process
            if (response?.status === 200) {
                // Send data to useContext
                // console.log('send LOGIN_SUCCESS');
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data.data.user
                })

                // Status check
                if (response.data.data.user.status === 'admin') {
                    navigate('/complain-admin')
                } else {
                    navigate('/home')
                }

                const alert = (
                    <Alert variant='success' className='py-1'>
                        Login success
                    </Alert>
                )
                setMessage(alert)
            }
        } catch (error) {
            const alert = (
                <Alert variant='danger' className='py-1'>
                    Login Failed
                </Alert>
            )
            setMessage(alert)
            console.log(error)
        }
    })

    return (
        <div className='d-flex align-items-center'>
            <div className='col-md-8 mx-auto bg-secondary bg-opacity-10 rounded'>
                <form onSubmit={(e) => handleSubmit.mutate(e)} className='p-4'>
                    <h2 className='mb-4 fw-bolder text-white'>Login</h2>
                    {message && message}
                    <div className='mb-3'>
                        <input
                            type='email'
                            className='form-control bg-input text-white'
                            placeholder='Email'
                            value={email}
                            name='email'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-3'>
                        <input
                            type='password'
                            className='form-control bg-input text-white'
                            placeholder='Password'
                            value={password}
                            name='password'
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type='submit'
                        className='btn btn-danger col-12 fs-6 fw-bold'
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default FormLogin