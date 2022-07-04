import React, { useContext, useState } from 'react'
import { useMutation } from 'react-query'
import { Alert } from 'react-bootstrap'

import { UserContext } from '../../context/userContext'
import { API } from '../../config/api'

const FormRegister = () => {
    const title = 'Register'
    document.title = 'DumbMerch | ' + title

    const [state, dispatch] = useContext(UserContext)
    const [message, setMessage] = useState(null)
    // Create variabel for store data with useState here ...
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = form

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
            const body = JSON.stringify(form)

            // Insert data user to database
            const response = await API.post('/register', body, config)
            // console.log(response)

            // Notification
            if (response.data.status === "success") {
                const alert = (
                    <Alert variant="success" className="py-1">
                        Register Success
                    </Alert>
                )
                setMessage(alert)
                setForm({
                    name: '',
                    email: '',
                    password: '',
                })
            } else {
                const alert = (
                    <Alert variant="danger" className="py-1">
                        {response.data.message}
                    </Alert>
                )
                setMessage(alert)
            }
        } catch (error) {
            const alert = (
                <Alert variant="danger" className="py-1">
                    Register Failed
                </Alert>
            )
            setMessage(alert)
            console.log(error)
        }
    })

    return (
        <div className="d-flex align-items-center">
            <div className="col-md-8 mx-auto bg-secondary bg-opacity-10 rounded">
                <form onSubmit={(e) => handleSubmit.mutate(e)} className='p-4'>
                    <h2 className='mb-4 fw-bolder text-white'>Register</h2>
                    {message && message}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            placeholder='Name'
                            className="form-control bg-input text-white"
                            onChange={handleChange}
                            value={name}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder='Email'
                            className="form-control bg-input text-white"
                            onChange={handleChange}
                            value={email}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            placeholder='Password'
                            className="form-control bg-input text-white"
                            onChange={handleChange}
                            value={password}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-danger col-12 fs-6 fw-bold"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default FormRegister