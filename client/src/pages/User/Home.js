import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { useQuery } from 'react-query'
import convertRupiah from 'rupiah-format'

import NavbarUser from '../../components/navbar/NavbarUser'
// import DataDummy from '../../assets/fakeData/DataDummy'
import { UserContext } from '../../context/userContext'
import { API } from '../../config/api'

const Home = () => {
    const title = 'Shop';
    document.title = 'DumbMerch | ' + title;

    const [state] = useContext(UserContext);

    // console.log(state);

    let { data: products, refetch } = useQuery('productsCache', async () => {
        const response = await API.get('/products');
        // console.log(response);
        return response.data.data.products;
    });

    // console.log(products)

    return (
        <>
            <NavbarUser />
            <div className="container text-danger mt-5">
                <h3 className="mb-3">Product</h3>
                <Row className='d-flex align-items-center'>
                    {products?.map((Data, index) => (
                        <Col md='2'>
                            <Link to={`/detail-product/` + Data.id} className='m-1' style={{ textDecoration: 'none' }}>
                                <div className="text-white">
                                    <div className="card bg-dark">
                                        <img
                                            className="img-fluid"
                                            style={{ height: '312px' }}
                                            src={Data.image}
                                            alt={Data.image}
                                        />
                                        <div className="p-2">
                                            <h5 className='text-danger fw-bold'>{Data.name}</h5>
                                            <p className='mb-1'>{convertRupiah.convert(Data.price)}</p>
                                            <p className='mb-0'>Stock : {Data.qty}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>
        </>
    )
}

export default Home