import React from 'react'
import "./Footer.css"

const Footer = () => {
    return (
        <>
            <footer>
                <div className="mian_copiright">
                    <div className="copiright">
                        <p>© Copyright 2025 Skill Will Win. All Rights Reserved.</p>
                    </div>

                    <div className="developer" style={{ color: "#ffffff" }}>
                        <p style={{ cursor: "pointer", color: "#828282" }}
                            onClick={() =>
                                window.open(
                                    "https://www.linkedin.com/in/bhavin-parmar-304b312aa/",
                                    "_blank"
                                )
                            }>
                            Development by{" "}
                            <span>Bhavin</span>
                        </p>


                    </div>

                    <div className="policy_main">
                        <p>Privacy Policy</p>
                        <p>Term & Condition</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
