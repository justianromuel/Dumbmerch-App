import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'

import NavbarAdmin from '../../components/navbar/NavbarAdmin'
import { API } from '../../config/api'

const AddCategory = () => {
    const title = 'Add Category'
    document.title = 'DumbMerch | ' + title

    let navigate = useNavigate()

    const [category, setCategory] = useState('');

    const handleChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            // Configuration
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };

            // Data body
            const body = JSON.stringify({ name: category });

            // Insert category data
            const response = await API.post('/category', body, config);

            navigate('/category');
        } catch (error) {
            console.log(error);
        }
    })

    return (
        <>
            <NavbarAdmin />
            <div>
                <div className="container">
                    <div className="row">
                        <form onSubmit={(e) => handleSubmit.mutate(e)}>
                            <h2 className="text-light mt-5 mb-5 text-md-start text-center">Add Category</h2>
                            <input
                                type="text"
                                className="form-control bg-input mb-5 fw-bold text-white col-12"
                                id="formGroupExampleInput"
                                placeholder="Category"
                                name="category"
                                value={category}
                                onChange={handleChange}
                                required
                            />
                            <button className="btn btn-success col-12" type="submit">
                                Add Category
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddCategory