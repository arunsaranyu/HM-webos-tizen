import React from 'react'
import { useSelector } from 'react-redux'
import StaticReusable from '../../reusable/StaticReusable/StaticReusable.jsx'

const DeletePage = ({ direction }) => {
    const firstIndex = useSelector((state) => state?.landing?.firstIndex);
    return (
        <>
            {
                < StaticReusable
                    alert=""
                    alertType="Delete Account"
                    heading="Action Required!"
                    Description="Do you want permanently delete your account? Once account deleted it cannot be recovered."
                    ButtonTextArray={["Yes", "No"]}
                    totalButtons={2}
                    direction={direction || firstIndex || "home-list"}
                    from={"delete"}
                />
            }
        </>
    )
}

export default DeletePage