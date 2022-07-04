import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'

import NavbarAdmin from '../../components/navbar/NavbarAdmin'
// import DataDummy from '../../assets/fakeData/DataDummy'
import { API } from '../../config/api'

const EditProduct = () => {
    const title = 'Edit Product'
    document.title = 'DumbMerch | ' + title

    let navigate = useNavigate()
    const { id } = useParams()

    const [categories, setCategories] = useState([]) //Store all category data
    const [categoryId, setCategoryId] = useState([]) //Save the selected category id
    const [preview, setPreview] = useState(null) //For image preview
    const [product, setProduct] = useState({}) //Store product data
    const [form, setForm] = useState({
        image: '',
        name: '',
        desc: '',
        price: '',
        qty: '',
    }) //Store product data

    // Fetching detail product data by id from database
    useQuery('productCache', async () => {
        const response = await API.get('/product/' + id)
        // console.log(response);
        setPreview(response.data.data.data.image)
        setForm({
            ...form,
            name: response.data.data.data.name,
            desc: response.data.data.data.desc,
            price: response.data.data.data.price,
            qty: response.data.data.data.qty,
        })
        setProduct(response.data.data.data)
    })

    // Fetching category data
    useQuery('categoriesCache', async () => {
        const response = await API.get('/categories')
        // console.log(response);
        setCategories(response.data.data.categories)
    })

    // For handle if category selected
    const handleChangeCategoryId = (e) => {
        const id = e.target.value
        const checked = e.target.checked

        if (checked) {
            // Save category id if checked
            setCategoryId([...categoryId, parseInt(id)])
        } else {
            // Delete category id from variable if unchecked
            let newCategoryId = categoryId.filter((categoryIdItem) => {
                return categoryIdItem != id
            })
            setCategoryId(newCategoryId)
        }
    }

    // Handle change data on form
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value,
        })
        // Create image url for preview
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            // Configuration
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            }

            // Store data with FormData as object
            const formData = new FormData()
            if (form.image) {
                formData.set('image', form?.image[0], form?.image[0]?.name)
            }
            formData.set('name', form.name)
            formData.set('desc', form.desc)
            formData.set('price', form.price)
            formData.set('qty', form.qty)
            formData.set('categoryId', categoryId)
            // console.log('isi form:', form);
            // Insert product data
            const response = await API.patch('/product/' + product.id, formData, config)
            // console.log(response)
            navigate('/product')
        } catch (error) {
            console.log(error)
        }
    })

    useEffect(() => {
        const newCategoryId = product?.categories?.map((item) => {
            return item.id
        })

        setCategoryId(newCategoryId)
    }, [product])

    return (
        <>
            <NavbarAdmin />
            <div>
                <div className="container">
                    <h3 className='my-5'>Edit Product</h3>
                    <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        {preview && (
                            <div>
                                <img
                                    src={preview}
                                    style={{
                                        maxWidth: '150px',
                                        maxHeight: '150px',
                                        objectFit: 'cover',
                                        marginBottom: '5px'
                                    }}
                                    alt={preview}
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            className="form-control bg-transparent border-0 text-white"
                            id="inputGroupFile"
                            name='image'
                            onChange={handleChange}
                        />
                        <div>
                            <label className="form-label"></label>
                            <input
                                type="text"
                                className="form-control bg-input text-white"
                                placeholder="Product Name"
                                name='name'
                                onChange={handleChange}
                                value={form?.name}
                            />
                        </div>
                        <div>
                            <label className="form-label"></label>
                            <textarea
                                className="form-control bg-input text-white"
                                placeholder="Description"
                                name='desc'
                                onChange={handleChange}
                                value={form?.desc}
                            ></textarea>
                        </div>
                        <div>
                            <label className="form-label"></label>
                            <input
                                type="text"
                                className="form-control bg-input text-white"
                                placeholder="Price"
                                name='price'
                                onChange={handleChange}
                                value={form?.price}
                            />
                        </div>
                        <div>
                            <label className="form-label"></label>
                            <input
                                type="text"
                                className="form-control bg-input text-white"
                                placeholder="Qty"
                                name='qty'
                                onChange={handleChange}
                                value={form?.qty}
                            />
                        </div>
                        <div className="card-form-input mt-4 px-2 py-1 pb-2">
                            <div
                                className="text-secondary mb-1"
                                style={{ fontSize: '15px' }}
                            >
                                Category
                            </div>
                            {categories.map((item, index) => (
                                <label className="checkbox-inline me-4" key={index}>
                                    <input
                                        type="checkbox"
                                        value={item.id}
                                        onClick={handleChangeCategoryId}
                                    />{' '}
                                    {item.name}
                                </label>
                            ))}
                        </div>
                        <button className="btn btn-success col-12 mt-5" type="submit">
                            Edit Product
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditProduct