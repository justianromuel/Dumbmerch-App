import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'

import NavbarAdmin from '../../components/navbar/NavbarAdmin'
// import DataDummy from '../../assets/fakeData/DataDummy'
import DeleteButton from '../../components/modal/DeleteButton'
import { API } from '../../config/api'

const Product = () => {
    const title = 'Product Admin'
    document.title = 'DumbMerch | ' + title

    let navigate = useNavigate()

    // Create variabel for id product and confirm delete data with useState here ...
    // Variabel for delete product data
    const [idDelete, setIdDelete] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    // Create init useState & function for handle show-hide modal confirm here ...
    // Modal Confirm delete data
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    // Fetching products data from database
    let { data: products, refetch } = useQuery("productsCache", async () => {
        const response = await API.get("/products")
        // console.log('response:', response)
        return response.data.data.products
    })

    const addProduct = () => {
        navigate('/add-product');
    }

    const handleEdit = (id) => {
        navigate("/edit-product/" + id)
    }

    // Create function handle get id product & show modal confirm delete data here ...
    // For get id product & show modal confirm delete data
    const handleDelete = (id) => {
        setIdDelete(id)
        handleShow()
    }

    // Create function for handle delete product here ...
    // If confirm is true, execute delete data
    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/product/${id}`)
            refetch()
        } catch (error) {
            console.log(error)
        }
    })
    // Call function for handle close modal and execute delete data with useEffect here ...
    useEffect(() => {
        if (confirmDelete) {
            // Close modal confirm delete data
            handleClose()
            // execute delete data by id function
            deleteById.mutate(idDelete)
            setConfirmDelete(null)
        }
    }, [confirmDelete])

    return (
        <>
            <NavbarAdmin />
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h3 className="text-light mt-5 text-lg-start text-center">List Product</h3>
                        <div className='row justify-content-end'>
                            <button
                                className="btn btn-secondary mt-5 col-1"
                                onClick={addProduct}
                            >
                                Add
                            </button>
                        </div>
                        <table className="table table-dark table-striped mt-2">
                            <thead>
                                <tr className="text-center">
                                    <th scope="col">No</th>
                                    <th scope="col">Photo</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Product Desc</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Qty</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((Data, index) => (
                                    <tr className='text-center'>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img className="img" width={100} height={100} src={Data.image} />
                                        </td>
                                        <td>{Data.name}</td>
                                        <td>{Data.desc.slice(0, 15)}...</td>
                                        <td>{Data.price}</td>
                                        <td>{Data.qty}</td>
                                        <td>
                                            <button
                                                className="btn btn-success col-3 me-3"
                                                onClick={() => {
                                                    handleEdit(Data.id)
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger col-3 me-3"
                                                onClick={() => {
                                                    handleDelete(Data.id)
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <DeleteButton
                setConfirmDelete={setConfirmDelete}
                show={show}
                handleClose={handleClose}
            />
        </>
    )
}

export default Product