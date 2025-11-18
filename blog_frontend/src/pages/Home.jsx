import React, { useEffect, useRef, useState } from 'react'
import "./Home.css"
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {

    let nav = useNavigate();

    const [schoolInfo, setSchoolInfo] = useState("");

    const getschoolInfo = async () => {

        try {
            let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/totalstudentandschools`)
            setSchoolInfo(res.data)
        } catch (error) {
            console.error("❌ Backend not running:", error.message);
        }

    }

    let subjects = useRef(new Set());
    const considerCategory = (candidate) => {
        if (candidate) {
            subjects.current.add(candidate);
        }
    };
    useEffect(() => {

        heightDesider();
        getschoolInfo()

        window.addEventListener('resize', heightDesider);

        return () => {
            window.addEventListener('resize', heightDesider);
        }

    }, []);

    const heightDesider = () => {
        subjects.current.forEach((candidate) => {
            candidate.style.height = 'auto';
        });

        let type = [];

        subjects.current.forEach((candidate) => {
            type.push(candidate.getBoundingClientRect().height);
        });

        const maxHeight = type ? Math.ceil(Math.max(...type)) : 0;

        subjects.current.forEach((candidate) => {
            candidate.style.height = `${maxHeight}px`;
        });
    }

    return (
        <>
            <div className='warapper'>
                <Navbar />

                <div className="catagory_wraper">
                    <div className="catagory_main_conatiner">

                        <div className="catagoty_main_title">
                            <p className='catagory_title'>“In Sight In Mind - જે નજરમાં એ મગજમાં”</p>
                            <p className='catagory_subtitle'>સફળ વિદ્યાર્થી , શ્રેષ્ઠ રમતવીર , શસ્ક્ત મહિલા અને સારા નાગરિક બનવા સંલગ્ન માહિતી - માર્ગદર્શન - મોટિવેશન પૂરું પાડતું  ડીઝીટલ માધ્યમ .</p>
                        </div>

                        <div className="catagory_4s_logo">
                            <img src="/4slogo.svg" alt="" />
                        </div>

                        <div className="catagory_main">

                            <div className="catasgory_row">

                                <div className="left_catagory"
                                    onClick={() => nav("/bloglisting", {
                                        state: {
                                            bgColor: "#f8f1ed", // background color
                                            mainCatagory: "Skill Will Win",
                                            subTitle: "એજ્યુકેશનલ સ્કિલ ડેવલોપમેન્ટ કોન્સેપ્ટ. (ધો - 8 to 12)",
                                            titleColor: "#AB541F"
                                        }
                                    })}>
                                    <img src="/skill_will_win.svg" alt="" />
                                </div>

                                <div className="right_catagory" onClick={() => nav("/bloglisting", {
                                    state: {
                                        bgColor: "#e6ecea", // background color
                                        mainCatagory: "બહાદુર બેટી",
                                        subTitle: "સ્વબચાવ, સલામતી, સજાગતા સલગ્ન માહિતી માર્ગદર્શન મોટિવેશન.",
                                        titleColor: "#2c7864"
                                    }
                                })}>
                                    <img src="/bahadur_beti.svg" alt="" />
                                </div>

                            </div>

                            <div className="catasgory_row">

                                <div className="left_catagory" onClick={() => nav("/bloglisting", {
                                    state: {
                                        bgColor: "#e6ecea", // background color
                                        mainCatagory: "તૈયારી જીત કી",
                                        subTitle: "સ્પોર્ટ્સ - રમતગમત ક્ષેત્રે સફળ કારકિર્દી ઘડતર માટે જરૂરી માહિતી માર્ગદર્શન મોટિવેશન.",
                                        titleColor: "#2c7864"
                                    }
                                })}>
                                    <img src="/tyari_jitki.svg" alt="" />

                                </div>
                                <div className="right_catagory" onClick={() => nav("/bloglisting", {
                                    state: {
                                        bgColor: "#f8f1ed", // background color
                                        mainCatagory: "મેં ભી ગાંધી",
                                        subTitle: "વર્તણુક બદલાવ (બીહેવીયર ચેન્જ) સલગ્ન કોન્સેપ્ટ.",
                                        titleColor: "#AB541F"
                                    }
                                })}>

                                    <img src="/mebhi_gandhi.svg" alt="" />
                                </div>
                            </div>
                            <div className="catasgory_row">
                                <div className="left_catagory" onClick={() => nav("/bloglisting", {
                                    state: {
                                        bgColor: "#f8f1ed", // background color
                                        mainCatagory: "લાઈફ લેશન ફ્રોમ લિજેન્ડ",
                                        subTitle: "આપણા સફળ વ્યક્તિત્વના ઘડતર માટે વિશ્વના મહાનાયકોના જીવનમાંથી લઈ શકાતા લાઈફ લેશન",
                                        titleColor: "#AB541F"
                                    }
                                })} >
                                    <img src="/lifefashion.svg" alt="" />

                                </div>
                                <div className="right_catagory" onClick={() => nav("/bloglisting", {
                                    state: {
                                        bgColor: "#e6ecea", // background color
                                        mainCatagory: "શાળા એક્ટિવિટી કેલેન્ડર",
                                        subTitle: "વિદ્યાર્થીઓના સર્વાંગી વિકાસ માટે જરૂરી ઇત્તર પ્રવૃત્તિ સલગ્ન સુચનો.",
                                        titleColor: "#2C7864"
                                    }
                                })}>
                                    <img src="/school_activity.svg" alt="" />

                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="helpline_main_container_wrapper">

                    <div className="helpline_main_containe_main">

                        <div className="helpline_icon_main">
                            <img src="/helpline.svg" alt="" />
                        </div>

                        <div className="helpline_number_main">
                            <p className='helpline_text'>હેલ્પલાઇન નંબર</p>
                            <p className='helpline_number'>70462 53732 </p>

                        </div>

                    </div>



                </div>
                <div className="partner_logo_main_wrapper">
                    <div className="partner_logo_main">

                        <div className="logo_img">
                            <div className="logo_content">Founder & Concept by</div>
                            <div className="founder_name">
                                <a href="" rel="noopener noreferrer">
                                    <img src="/founder_name.svg" alt="" className='patnar_logo' />
                                </a>
                            </div>
                        </div>


                        <div className="logo_img">

                            <div className="logo_content">Our Support Partner</div>

                            <div className="logo_img_container">
                                <a
                                    href="https://www.nilkanthjewellers.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src="/patnar_logo.svg" alt="" className='patnar_logo' />
                                </a>

                            </div>
                        </div>
                    </div>

                </div>


                <div className="success_story_main_wrapper">
                    <div className="success_story_main">

                        <p className='success_story_main_title'>Success Story</p>


                        <div className="school_details_and_student_main">
                            <div className="school_details_main">
                                <div className="school_icon_and_school_no">
                                    <div className="school_icon">
                                        <img src="/school_icon.svg" alt="" />
                                    </div>
                                    <div className="school_no">
                                        <p>{schoolInfo.totalSchools} +</p>
                                    </div>
                                </div>
                                <div className="school_text">
                                    <p>શાળાઓ</p>
                                </div>
                            </div>


                            <div className="school_details_main">

                                <div className="school_icon_and_school_no">
                                    <div className="school_icon">
                                        <img src="/student_icon.svg" alt="" />
                                    </div>
                                    <div className="school_no">
                                        <p className='student_no_color'>{schoolInfo.totalStudents} +</p>
                                    </div>
                                </div>
                                <div className="school_text">
                                    <p>વિદ્યાર્થીઓ</p>
                                </div>

                            </div>

                        </div>


                    </div>
                </div>


                <div className="contect_details_main_wrapper">


                    <div className="contect_details_main">

                        <p className='Contect_details_title'>Contact</p>

                        <div className="contect_details">

                            <div ref={considerCategory} className="email_details_main">

                                <div className="detail_email_icon">
                                    <img src="/email_contect.svg" alt="" />
                                </div>

                                <p className='contect_email'>skillwillwin@gmail.com</p>
                            </div>

                            <div ref={considerCategory} className="email_details_main">

                                <div className="detail_email_icon">
                                    <img src="/locations_icon.svg" alt="" />
                                </div>

                                <p className='contect_addresh'>Karmayog consultancy, 1st floor
                                    near head post office, Amreli - Gujarat</p>
                            </div>

                        </div>



                    </div>
                </div>

                <Footer />
            </div>


        </>
    )
}

export default Home
