import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'

import NavbarAdmin from '../../components/navbar/NavbarAdmin'
// import DataCategory from '../../assets/fakeData/DataCategory'
import { API } from '../../config/api'

const EditCategory = () => {
    const title = 'Edit Category'
    document.title = 'DumbMerch | ' + title

    let navigate = useNavigate()

    const { id } = useParams()

    const [category, setCategory] = useState({
        name: ''
    })

    useQuery('categoryCache', async () => {
        const response = await API.get('/category/' + id)
        // console.log(response)
        setCategory({ name: response.data.data.category.name })
    })

    const handleChange = (e) => {
        setCategory({
            ...category,
            name: e.target.value,
        })
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            }

            const body = JSON.stringify(category)

            const response = await API.patch('/category/' + id, body, config)

            navigate('/category')
        } catch (error) {
            console.log(error)
        }
    })

    return (
        <>
            <NavbarAdmin />
            <div>
                <div className="container">
                    <div className="row">
                        <h2 className="text-light mt-5 mb-5 text-md-start text-center">Edit Category</h2>
                        <form onSubmit={(e) => handleSubmit.mutate(e)}>
                            <div className="col"></div>
                            <input
                                type="text"
                                className="bg-input mb-5 fw-bold form-control text-white"
                                id="formGroupExampleInput"
                                placeholder="Category"
                                value={category.name}
                                onChange={handleChange}
                            />
                            <button className="btn btn-success col-12" type="submit">
                                Edit Category
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditCategory