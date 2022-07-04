import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'

const DeleteButton = ({ show, handleClose, setConfirmDelete }) => {
    const handleDelete = () => {
        setConfirmDelete(true)
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false} className="text-black" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this data?</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleDelete} className="col-3">
                        Yes
                    </Button>
                    <Button variant="danger" onClick={handleClose} className="col-3">
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteButton