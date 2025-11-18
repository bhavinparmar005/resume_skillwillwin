import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import "./Blog_Listing_Page.css"
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const Blog_Listing_Page = () => {
    const location = useLocation();
    let nav = useNavigate();
    const navbarRef = useRef();
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true);

    const [blogs, setBlogs] = useState([])
    const { bgColor, mainCatagory, titleColor, subTitle } = location.state || {};
    const isTransitioningToLogin = useRef(false);

    const getBlogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/allblog`);
            setBlogs(res.data.data || []);
        } catch (error) {
            console.error("❌ Backend not running:", error.message);
            setBlogs([]);
        }
        setLoading(false);
    }

    let filterCatagory = blogs.filter((val) => val.category == mainCatagory)
    // console.log(filterCatagory)

    useEffect(() => {
        getBlogs()
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (showPopup) {
            document.body.style.overflow = "hidden";
            return () => {
                if (!isTransitioningToLogin.current) {
                    document.body.style.overflow = "auto";
                }
            };
        }
    }, [showPopup]);

    return (
        <>
            <div className='warapper'>
                <Navbar ref={navbarRef} />
                <div className="dynamic_catagory_ditails_main" style={{ backgroundColor: bgColor }}>
                    <div className="warrper_to_dynamic_catagory">
                        <p style={{ color: titleColor }}>{mainCatagory}</p>
                        <h3>{subTitle}</h3>
                    </div>
                </div>

                <div className="catagory_card_main_warapper">
                    <div className="catagory_card_main">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div className="catagory_card" key={i}>
                                    <div className="catagory_image_main">
                                        <div className="skeleton skeleton-img"></div>
                                    </div>
                                    <div className="catagory_details_main">
                                        <div className="skeleton skeleton-title"></div>
                                        <div className="skeleton skeleton-text"></div>
                                        <div className="skeleton skeleton-text" style={{ width: "80%" }}></div>
                                        <div className="skeleton skeleton-text" style={{ width: "60%" }}></div>
                                    </div>
                                </div>
                            ))
                        ) : filterCatagory.length > 0 ? (
                            filterCatagory.map((val, i) => (
                                <div
                                    className="catagory_card"
                                    key={i}
                                    onClick={() => {
                                        const loginData = localStorage.getItem("schoolData");
                                        if (!loginData && i !== 0) {
                                            setShowPopup(true);
                                            return;
                                        }
                                        nav("/blogdetails", { state: { ...val, bgColor, i, mainCatagory, filterCatagory } });
                                    }}
                                >
                                    <div className="catagory_image_main">
                                        <img src={val.image.url} alt="" />
                                    </div>
                                    <div className="catagory_details_main">
                                        <p className="catagory_details_title">{val.title}</p>
                                        <p className="catagory_details_description">{val.shortDescription}</p>
                                        <button className="read_more_button">Read More</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", width: "100%", marginTop: "20px" }}>
                                🚫 No Blogs Found
                            </p>
                        )}
                    </div>
                </div>

                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-box">
                            <div className="main_access_modal">
                                <div className="access_title">
                                    <p>Register Your School to Access More Blogs</p>
                                </div>
                                <div className="access_close_icon" onClick={() => { setShowPopup(false) }}>
                                    <img src="/x-close.svg" alt="" />
                                </div>
                            </div>
                            <p className='access_subtitle'>Reach out to the admin & complete your registration today</p>

                            <div className="access_contect_main">
                                <div className="access_contect_icon">
                                    <img src="/helpline.svg" alt="" />
                                </div>
                                <div className="access_number">
                                    <p className='access_number_text'>ફોન નંબર</p>
                                    <p className='access_Contect_number'>70462 53732 </p>
                                </div>
                            </div>

                            <p className='access_already_account_text'>Already have an account?</p>
                            <button
                                className='access_Login_button'
                                onClick={() => {
                                    isTransitioningToLogin.current = true;
                                    setShowPopup(false);
                                    if (navbarRef.current) {
                                        navbarRef.current.openLoginPopup();
                                    }
                                    setTimeout(() => {
                                        isTransitioningToLogin.current = false;
                                    }, 100);
                                }}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </>
    )
}

export default Blog_Listing_Page
