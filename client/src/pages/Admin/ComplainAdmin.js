import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import NavbarAdmin from '../../components/navbar/NavbarAdmin'
// import User1 from '../../assets/images/User1.png'
// import User2 from '../../assets/images/User2.png'
import { UserContext } from '../../context/userContext'
import Contact from '../../components/complain/Contact'
import Chat from '../../components/complain/Chat'

// import socket.io-client 
import { io } from 'socket.io-client'

// initial variable outside socket
let socket
const ComplainAdmin = () => {
    const title = "Complain Admin"
    document.title = 'DumbMerch | ' + title

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])
    const [state] = useContext(UserContext)

    useEffect(() => {
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            }
        })

        socket.on("new message", () => {
            socket.emit('load messages', contact?.id)
        })

        loadContacts()
        loadMessages()

        return () => {
            socket.disconnect()
        }
    }, [messages])

    const loadContacts = () => {
        socket.emit("load customer contacts")
        socket.on("customer contacts", (data) => {
            // filter just customers which have sent a message
            let dataContacts = data.map((item) => ({
                ...item,
                message: item.senderMessage.length > 0 ? item.senderMessage[item.senderMessage.length - 1].message : 'Click here to start message'
            }))

            // manipulate customers to add message property with the newest message
            setContacts(dataContacts)
        })
    }

    // used for active style when click contact
    const onClickContact = (data) => {
        setContact(data)
        socket.emit('load messages', data.id)
    }

    const loadMessages = () => {
        socket.on('messages', async (data) => {
            if (data.length > 0) {
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages)
                loadContacts()
            } else {
                setMessages([])
                loadContacts()
            }
        })
    }

    const onSendMessage = (e) => {
        if (e.key == "Enter") {
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }

            socket.emit('send message', data)
            e.target.value = ''
        }
    }

    return (
        <>
            <NavbarAdmin />
            <Container fluid style={{ height: '89.5vh' }}>
                <Row>
                    <Col md={3} style={{ height: '89.5vh' }} className="px-3 border-end border-dark overflow-auto">
                        <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
                    </Col>
                    <Col md={9} style={{ height: '89.5vh' }} className="px-3 border-end border-dark overflow-auto">
                        <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ComplainAdmin