import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import "./Blog_details.css"

const Blog_details = () => {
    const location = useLocation();
    let nav = useNavigate();
    const { bgColor, description, title, image, i, filterCatagory } = location.state || {}
    const [loginData, setLoginData] = useState(localStorage.getItem("schoolData"));

    // Logic to always get next 3 blogs
    let nextBlogs = [];
    if (filterCatagory && filterCatagory.length > 0) {
        if (i + 3 < filterCatagory.length) {
            nextBlogs = filterCatagory.slice(i + 1, i + 4);
        } else {
            const remaining = filterCatagory.slice(i + 1);
            const fromStart = filterCatagory.slice(0, 3 - remaining.length);
            nextBlogs = [...remaining, ...fromStart];
        }
    }

    // ✅ Listen for login/logout custom event
    useEffect(() => {
        const updateLoginData = () => {
            setLoginData(localStorage.getItem("schoolData"));
        };

        // Mount pe check
        updateLoginData();

        // Event listener
        window.addEventListener("loginStatusChange", updateLoginData);

        return () => {
            window.removeEventListener("loginStatusChange", updateLoginData);
        };
    }, []);

    // Scroll top jab bhi naya blog open ho
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <>
            <div className='warapper'>
                <Navbar />

                <div className="blog_title_background" style={{ backgroundColor: bgColor }}>
                    <p className='single_blog_title'>{title || "Data Not Found"}</p>
                </div>

                <div className="image_and_description_main">
                    <div className="image_and_description">
                        <div className="blog_img_main">
                            {image?.url ? (
                                <img src={image.url} alt={title || "No Title"} />
                            ) : (
                                <p>Image Not Found</p>
                            )}
                        </div>
                        <div
                            className='blog_description'
                            dangerouslySetInnerHTML={{ __html: description || "<p>Data Not Found</p>" }}
                        />
                    </div>
                </div>

                {/* ✅ यह section सिर्फ तब दिखेगा जब loginData हो */}
                {loginData && (
                    <div className="other_blog_post_main">
                        <div className='other_blog_heading'>
                            <p>બીજી પોસ્ટ</p>
                        </div>

                        <div className="catagory_card_main_warapper" style={{ marginTop: "0px" }}>
                            <div className="catagory_card_main">
                                {nextBlogs.length > 0 ? (
                                    nextBlogs.map((val, index) => (
                                        <div className="catagory_card" key={index} onClick={() => {
                                            nav("/blogdetails", {
                                                state: {
                                                    ...val,
                                                    i: filterCatagory.findIndex(b => b._id === val._id),
                                                    filterCatagory
                                                }
                                            });
                                        }}>
                                            <div className="catagory_image_main">
                                                {val?.image?.url ? (
                                                    <img src={val.image.url} alt={val.title || "No Title"} />
                                                ) : (
                                                    <p>No Image</p>
                                                )}
                                            </div>
                                            <div className="catagory_details_main" style={{ backgroundColor: "#ffffff" }}>
                                                <p className="catagory_details_title">{val.title || "No Title"}</p>
                                                <p className='catagory_details_description'>
                                                    {val.shortDescription || "No Description"}
                                                </p>
                                                <button className='read_more_button'> Read More </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: "center", width: "100%", marginTop: "20px" }}>
                                        Data Not Found
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </>
    )
}

export default Blog_details;
