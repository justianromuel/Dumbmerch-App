import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'

import NavbarAdmin from '../../components/navbar/NavbarAdmin'
// import DataCategory from '../../assets/fakeData/DataCategory'
import DeleteButton from '../../components/modal/DeleteButton'
import { API } from '../../config/api'


const Category = () => {
    const title = 'Category Admin'
    document.title = 'DumbMerch | ' + title

    let navigate = useNavigate()

    // Create variabel for id category and confirm delete data with useState here ...
    // Variabel for delete category data
    const [idDelete, setIdDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Create init useState & function for handle show-hide modal confirm here ...
    // Modal Confirm delete data
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let { data: categories, refetch } = useQuery('categoriesCache', async () => {
        const response = await API.get('/categories');
        // console.log(response);
        return response.data.data.categories;
    });

    const addCategory = () => {
        navigate('/add-category');
    };

    const handleEdit = (id) => {
        navigate(`/edit-category/${id}`);
    };

    // Create function handle get id category & show modal confirm delete data here ...
    // For get id category & show modal confirm delete data
    const handleDelete = (id) => {
        setIdDelete(id);
        handleShow();
    };

    // Create function for handle delete category here ...
    // If confirm is true, execute delete data
    const deleteById = useMutation(async (id) => {
        try {
            await API.delete(`/category/${id}`);
            refetch();
        } catch (error) {
            console.log(error);
        }
    });
    // Call function for handle close modal and execute delete data with useEffect here ...
    useEffect(() => {
        if (confirmDelete) {
            // Close modal confirm delete data
            handleClose();
            // execute delete data by id function
            deleteById.mutate(idDelete);
            setConfirmDelete(null);
        }
    }, [confirmDelete]);

    return (
        <>
            <NavbarAdmin />
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h3 className="text-light mt-5 text-lg-start text-center">List Category</h3>
                        <div className='row justify-content-end col-12'>
                            <button
                                className="btn btn-secondary mt-5 col-1"
                                onClick={addCategory}
                            >
                                Add
                            </button>
                        </div>
                        <table className="table table-dark table-striped mt-2">
                            <thead>
                                <tr>
                                    <th scope="col">No</th>
                                    <th scope="col">Category Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories?.map((Data, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{Data.name}</td>
                                        <div>
                                            <button
                                                className="btn btn-success col-3 me-3"
                                                onClick={() => {
                                                    handleEdit(Data.id);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger col-3 me-3"
                                                onClick={() => {
                                                    handleDelete(Data.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
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

export default Category