import React, { useContext, useState } from 'react'

import NavbarUser from '../../components/navbar/NavbarUser'
// import DataUser from '../../assets/fakeData/DataUser';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../config/api';
import { useMutation, useQuery } from 'react-query';

const EditProfile = () => {
    const title = "Edit Profile";
    document.title = "DumbMerch | " + title;

    let navigate = useNavigate()

    const [preview, setPreview] = useState(null) //For image preview
    const [profile, setProfile] = useState({}) //Store profile data
    const [form, setForm] = useState({
        image: '',
        phone: '',
        gender: '',
        address: '',
    }) //Store profile data

    // Fetching profile data from database
    useQuery("profileCache", async () => {
        const response = await API.get("/profile");
        // console.log(response);
        setPreview(response.data.data.image)
        setForm({
            ...form,
            name: response.data.data.user.name,
            phone: response.data.data.phone,
            gender: response.data.data.gender,
            address: response.data.data.address,
        })
        setProfile(response.data.data)
    })


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
            formData.set('phone', form.phone)
            formData.set('gender', form.gender)
            formData.set('address', form.address)
            console.log('isi form:', form);
            // Insert profile data
            const response = await API.patch('/profile', formData, config)
            // console.log(response)
            navigate('/profile')
        } catch (error) {
            console.log(error)
        }
    })

    return (
        <>
            <NavbarUser />
            <div>
                <div className="container">
                    <h3 className='my-5'>Edit Profile</h3>
                    <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        {preview && (
                            <div>
                                <img
                                    src={preview}
                                    style={{
                                        maxWidth: '150px',
                                        maxHeight: '150px',
                                        objectFit: 'cover',
                                        marginBottom: '5px',
                                        borderRadius: '10%'
                                    }}
                                    alt='preview'
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
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control bg-input text-white"
                                placeholder="Name"
                                name='name'
                                onChange={handleChange}
                                value={form?.name}
                            />
                        </div>
                        <div>
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control bg-input text-white"
                                placeholder="Phone"
                                name='phone'
                                onChange={handleChange}
                                value={form?.phone}
                            />
                        </div>
                        <div>
                            <label className="form-label">Gender</label>
                            <input
                                type="text"
                                className="form-control bg-input text-white"
                                placeholder="Gender"
                                name='gender'
                                onChange={handleChange}
                                value={form?.gender}
                            />
                        </div>
                        <div>
                            <label className="form-label">Address</label>
                            <textarea
                                className="form-control bg-input text-white"
                                placeholder="Address"
                                name='address'
                                onChange={handleChange}
                                value={form?.address}
                            ></textarea>
                        </div>
                        <button className="btn btn-success col-12 mt-5" type="submit">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditProfile