import React, { useEffect } from 'react'
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import convertRupiah from 'rupiah-format'

import NavbarUser from '../../components/navbar/NavbarUser'
// import DataDummy from '../../assets/fakeData/DataDummy'
import { API } from '../../config/api';

const DetailProduct = () => {
    let navigate = useNavigate()
    let { id } = useParams()

    // Fetching product data from database
    let { data: product, refetch } = useQuery("productCache", async () => {
        const response = await API.get("/product/" + id);
        // console.log('cek response', response);
        return response.data.data.data;
    })
    // console.log('product', product);

    // Create config Snap payment page with useEffect here ...
    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = "SB-Mid-client-vHbZt8xIeGsE87F0";

        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    const handleBuy = useMutation(async (e) => {
        try {
            e.preventDefault();

            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };

            const data = {
                idProduct: product.id,
                idSeller: product.user.id,
                price: product.price,
            };

            const body = JSON.stringify(data);

            const response = await API.post('/transaction', body, config);
            // console.log("response", response);
            const token = response.data.payment.token;

            // console.log("ini cek token:", token);

            window.snap.pay(token, {
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    alert("you closed the popup without finishing the payment");
                },
            });
        } catch (error) {
            console.log(error);
        }
    })

    return (
        <>
            <NavbarUser />
            <div className="">
                <div class="row justify-content-center">
                    <div class="col-4">
                        <img
                            className="img-fluid"
                            src={product?.image}
                            alt={product?.image}
                        />
                    </div>
                    <div class="col-4">
                        <h1 className='text-danger fw-bold'>{product?.name}</h1>
                        <div>
                            <p>Stok : {product?.qty}</p>
                            {/* <ul>
                                <li>Spesifikasi 1</li>
                                <li>Spesifikasi 2</li>
                                <li>Spesifikasi 3</li>
                                <li>Spesifikasi 4</li>
                                <li>Spesifikasi 5</li>
                            </ul> */}
                            <p className='justify'>
                                {product?.desc}
                            </p>
                            <div className='text-danger text-end my-3 fs-5 fw-bold'>{convertRupiah.convert(product?.price)}</div>
                        </div>
                        <button onClick={(e) => handleBuy.mutate(e)} className='btn btn-danger col-12'>Buy</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailProduct