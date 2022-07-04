import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import convertRupiah from 'rupiah-format'
import dateFormat from 'dateformat';
import { Container, Row, Col } from 'react-bootstrap'

import NavbarUser from '../../components/navbar/NavbarUser'
// import DataUser from '../../assets/fakeData/DataUser';
import ProfilImage from '../../assets/images/Anonim.png'
// import Logo from '../../assets/images/LogoDumbmerch.png'
import { API } from '../../config/api';

const Profile = () => {
    const title = "Profile";
    document.title = "DumbMerch | " + title;

    let navigate = useNavigate()

    // Fetching profile data from database
    const { data: profile } = useQuery("profileCache", async () => {
        const response = await API.get("/profile");
        // console.log(response);
        return response.data.data;
    })

    // Fetching transactions data from database
    let { data: transactions } = useQuery("transactionsCache", async () => {
        const response = await API.get("/transactions");
        // console.log("CEK TRANSAKSI:", response);
        return response.data.data.transaction;
    })

    const handleEdit = () => {
        navigate("/edit-profile")
    }

    return (
        <>
            <NavbarUser />
            <div className="Container">
                <div className="row justify-content-center pt-5">

                    <div className="col-5 text-light ml-5">
                        <h1 className="fw-bold text-danger">My Profile</h1>
                        <div class="d-flex">
                            <div class="p-2">
                                {profile?.image === "http://localhost:5000/uploads/-" ? (
                                    <img className="profile-image" src={ProfilImage} alt="profil-image" />
                                ) : (
                                    <img className="profile-image" src={profile?.image} alt="profil-image" />
                                )}
                            </div>
                            <div class="p-2">
                                <h5 className='fw-bold text-danger'>Name</h5>
                                <p className='fs-6'>{profile?.user.name}</p>

                                <h5 className='fw-bold text-danger'>Email</h5>
                                <p className='fs-6'>{profile?.user.email}</p>

                                <h5 className='fw-bold text-danger'>Phone</h5>
                                <p className='fs-6'>{profile?.phone ? profile.phone : '-'}</p>

                                <h5 className='fw-bold text-danger'>Gender</h5>
                                <p className='fs-6'>{profile?.gender ? profile.gender : '-'}</p>

                                <h5 className='fw-bold text-danger'>Address</h5>
                                <p className='fs-6'>{profile?.address ? profile.address : '-'}</p>

                                <button
                                    className="btn btn-danger col-12 fs-6 fw-bold"
                                    onClick={() => { handleEdit() }}
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-5 text-light ">
                        <h1 className="fw-bold text-danger">Transaction</h1>
                        <div className='transaction'>
                            <div className="card bg-dark">
                                <div className="card-body">
                                    <div className="row justify-content-center">
                                        {transactions?.length > 0 ? (
                                            <>
                                                {transactions?.map((Data, index) => (
                                                    <div
                                                        key={index}
                                                        style={{ background: '#303030' }}
                                                        className="p-2 mb-1"
                                                    >
                                                        <Container fluid className='px-1'>
                                                            <Row>
                                                                <Col xs='3'>
                                                                    <img
                                                                        className='img-fluid'
                                                                        style={{ height: '100px', width: '120px', objectFit: 'cover' }}
                                                                        src={Data.products?.image}
                                                                        alt="img-transaction"
                                                                    />
                                                                </Col>
                                                                <Col xs='6'>
                                                                    <div>
                                                                        <h6 className='mb-0 fw-bold text-danger'>{Data.products?.name}</h6>
                                                                        <h6 className='mb-0 text-danger'>{dateFormat(Data.createdAt, 'dddd, d mmmm yyyy')}</h6>
                                                                        <h6 className='mb-4 fw-lighter'>Price : {convertRupiah.convert(Data.price)}</h6>
                                                                        <h6 className='mb-0'>Sub total : {convertRupiah.convert(Data.price)}</h6>
                                                                    </div>
                                                                </Col>
                                                                <Col xs='3'>
                                                                    <div className={`status-transaction-${Data.status} rounded h-100 d-flex align-items-center justify-content-center`}>
                                                                        {Data.status}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div
                                                className="no-data-transaction mx-auto"
                                                style={{ background: '#303030' }}
                                            >
                                                No transaction
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile