import React from "react";

import LogoDumbmerch from "../../assets/images/LogoDumbmerch.png"
import anonim_profile_img from "../../assets/images/Anonim.png"

export default function Contact({ dataContact, clickContact, contact }) {
    // console.log('data contact', dataContact);
    return (
        <>
            {dataContact.length > 0 && (
                <>
                    {dataContact.map((item) => (
                        <div
                            key={item.id}
                            className={`contact mt-3 p-2 ${contact?.id === item?.id && "contact-active"
                                }`}
                            onClick={() => {
                                clickContact(item);
                            }}
                        >
                            {item.status === 'admin' ? (
                                <img
                                    src={LogoDumbmerch}
                                    className="rounded-circle me-2 img-contact"
                                    alt="user avatar"
                                />
                            ) : (
                                <img
                                    src={item.profile?.image !== "http://localhost:5000/uploads/-" ? item.profile?.image : anonim_profile_img}
                                    className="rounded-circle me-2 img-contact"
                                    alt="user avatar"
                                />
                            )}
                            <div className="ps-1 text-contact d-flex flex-column justify-content-around">
                                <p className="mb-0">{item.name}</p>
                                <p className="text-contact-chat mt-1 mb-0">
                                    {item.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
