import React, { useContext, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import FormRegister from '../components/form/FormRegister'
import FormLogin from '../components/form/FormLogin'

import ImageDumbmerch from '../assets/images/ImageDumbmerch.png'
import { UserContext } from '../context/userContext'

const Auth = () => {
    let navigate = useNavigate()

    const [state] = useContext(UserContext)
    // console.log('cek state', state);
    const checkAuth = () => {
        if (state.isLogin === true) {
            if (state.user.status === 'admin') {
                navigate("/complain-admin");
            } else {
                navigate('/home')
            }
        }
    }
    checkAuth()

    const [isRegister, setIsRegister] = useState(false)

    const switchLogin = () => {
        setIsRegister(false)
    }

    const switchRegister = () => {
        setIsRegister(true)
    }

    return (
        <div>
            <Container>
                <Row className="min-vh-100 d-flex align-items-center">
                    <Col md='6'>
                        <img
                            src={ImageDumbmerch}
                            alt="logo"
                            className="d-flex mx-auto ms-md-0"
                        />
                        <div className="mt-4 text-secondary">
                            <h1 className="fs-1 fw-bold d-flex justify-content-center justify-content-md-start text-white">Easy, Fast and Reliable</h1>
                            <p className="mt-3 fs-6 fw-lighter">
                                Go shopping for merchandise, just go to dumb merch <br />
                                shopping. the biggest merchandise in <b className='fw-bold'>Indonesia</b>
                            </p>
                        </div>
                        <div className="my-3 text=white">
                            <button
                                className="btn btn-danger px-5 fs-6 fw-bold"
                                onClick={switchLogin}
                            >
                                Login
                            </button>
                            {"  "}
                            <button
                                className="btn px-5 fs-6 fw-bold text-secondary"
                                onClick={switchRegister}
                            >
                                Register
                            </button>
                        </div>
                    </Col>
                    <Col md='6'>
                        {isRegister ? <FormRegister /> : <FormLogin />}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Auth