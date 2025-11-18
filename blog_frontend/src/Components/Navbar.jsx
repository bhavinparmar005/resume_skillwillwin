import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Navbar = forwardRef((props, ref) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        openLoginPopup: () => setIsPopupOpen(true),
        closeLoginPopup: () => setIsPopupOpen(false),
    }));

    const [schoolData, setSchoolData] = useState(localStorage.getItem("schoolData") || "");
    const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
    const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const [step, setStep] = useState(1);
    const [timer, setTimer] = useState(150);
    const [otpTimer, setOtpTimer] = useState(0);

    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);
    const nav = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [resetFormData, setResetFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [forgotData, setForgotData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const school = localStorage.getItem("schoolData");

        if (token && school) {
            setIsLoggedIn(true);
            setSchoolData(JSON.parse(school));
        }
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleResetChange = (e) => {
        setResetFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleForgotChange = (e) => {
        setForgotData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            Swal.fire({
                title: "Logging in...",
                text: "Please wait while we verify your credentials",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/schoollogin`, formData);

            const { token, school, message } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("schoolData", JSON.stringify(school.schoolname));
            setSchoolData(school.schoolname);

            setFormData({ email: "", password: "" });
            setIsPopupOpen(false);
            setIsLoggedIn(true);

            Swal.close();

            setTimeout(() => {
                Swal.fire({
                    icon: "success",
                    title: "Login Successful 🎉",
                    text: message || `Welcome back, ${school.email}!`,
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: "my-swal-popup",
                        title: "my-swal-title",
                    },
                    didOpen: (el) => {
                        el.style.fontFamily = "sans-serif";
                        el.style.fontSize = "16px";
                    },
                });
            }, 100);

        } catch (error) {
            console.error("Login failed ❌", error.response?.data || error.message);

            Swal.close();

            setTimeout(() => {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: error?.response?.data?.message || "Invalid email or password",
                    iconColor: "#dc2626",
                    confirmButtonColor: "#086885",
                    customClass: {
                        popup: "my-swal-popup",
                        title: "my-swal-title",
                    },
                    didOpen: (el) => {
                        el.style.fontFamily = 'sans-serif';
                        el.style.fontSize = "16px";
                    },
                });
            }, 100);

            setFormData({ email: "", password: "" });
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();

        if (resetFormData.newPassword !== resetFormData.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Mismatch",
                text: "New password and confirm password do not match ❌",
            });
            return;
        }

        try {
            Swal.fire({
                title: "Updating Password...",
                text: "Please wait",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/schoolresetpassword`,
                {
                    oldPassword: resetFormData.currentPassword,
                    newPassword: resetFormData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.close();
            Swal.fire({
                icon: "success",
                title: "Password Changed 🎉",
                text: res.data.message || "Your password has been updated successfully",
            });

            setResetFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setIsResetOpen(false);
        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.response?.data?.message || "Could not reset password ❌",
            });
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (step === 1) {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/schoolforgetpassword`,
                    { email: forgotData.email }
                );

                if (res.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "OTP Sent!",
                        text: "✅ OTP has been sent to your email.",
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    }).then(() => {
                        setStep(2);

                    });


                } else {
                    Swal.fire({
                        icon: "error",
                        title: "email not found !!",
                        text: res.data.message,
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
            }

            if (step === 2) {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/checkotp`,
                    { email: forgotData.email, otp: forgotData.otp }
                );

                if (res.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "OTP Verified",
                        text: "Now you can reset your password.",
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        setStep(3);
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "❌ Invalid OTP",
                        text: res.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                }
            }

            if (step === 3) {
                if (forgotData.newPassword !== forgotData.confirmPassword) {
                    Swal.fire({
                        icon: "error",
                        title: "❌ Passwords do not match",
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    return;
                }

                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/schoolupdatepassword`,
                    {
                        email: forgotData.email,
                        newPassword: forgotData.newPassword,
                    }
                );

                if (res.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "✅ Password Changed Successfully",
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    }).then(() => {
                        setIsForgotOpen(false)
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "❌ Error",
                        text: res.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                }
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong. Please try again later.",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("schoolData");
        setIsLoggedIn(false);
        setFormData({ email: "", password: "" });

        Swal.fire({
            icon: "success",
            title: "Logged Out ✅",
            text: "You have been logged out successfully.",
            timer: 2000,
            showConfirmButton: false,
            customClass: {
                popup: "my-swal-popup",
                title: "my-swal-title",
            },
            didOpen: (el) => {
                el.style.fontFamily = "sans-serif";
                el.style.fontSize = "16px";
            },
        }).then(() => {
            nav("/");
        });

    };

    useEffect(() => {
        if (isPopupOpen || isResetOpen || isForgotOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isPopupOpen, isResetOpen, isForgotOpen]);

    return (
        <>
            <header>
                <nav>
                    <div className="main_title" onClick={() => nav("/")}>
                        <img src="/logo.svg" alt="Skill Will Win logo" />
                    </div>

                    {isLoggedIn ? (
                        <div className="dropdown_main" onClick={() => setIsOpen(!isOpen)}>
                            <div className="flex_box">
                                <div className="school_icon_dropdown">
                                    <img src="/navbar_school_icon.svg" alt="" />
                                </div>
                                <div className="navbar_school_name_main">
                                    <p className="navbar_school_name">   {schoolData ? (schoolData) : "School Name"}
                                    </p>
                                </div>
                                <div className="dropdown_icon">
                                    {isOpen ? (
                                        <img src="/dropdown_up_icon.svg" alt="" />
                                    ) : (
                                        <img src="/dropdown_down_icon.svg" alt="" />
                                    )}
                                </div>
                            </div>

                            {isOpen && (
                                <div className="dropdown-menu">
                                    <div className="item">
                                        <p
                                            className="dropdown_change_password"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsResetOpen(true);
                                            }}
                                        >
                                            Change Password
                                        </p>
                                        <p className="dropdown_logout_password" onClick={handleLogout}>Logout</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="navbar_login_button" onClick={() => setIsPopupOpen(true)}>Login</button>
                    )}
                </nav>
            </header>

            {isPopupOpen && (
                <form className="popup_overlay" onSubmit={handleSubmit}>
                    <div className="popup">
                        <div className="login_heading_main">
                            <div className="heading_title">
                                <p>Login into Your Account</p>
                            </div>
                            <div className="close_icon" onClick={() => setIsPopupOpen(false)}>
                                <img src="/x-close.svg" alt="" />
                            </div>
                        </div>

                        <p className="info">Please enter your account details</p>
                        <label className="label_for_email">Email Address</label>
                        <div className="input_email_main">
                            <div className="email_icon">
                                <img src="/email_icon.svg" alt="" />
                            </div>
                            <div className="input_type_email">
                                <input
                                    type="email"
                                    placeholder="Enter email address..."
                                    name="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    required
                                />
                            </div>
                        </div>

                        <label className="label_for_email">Password</label>
                        <div className="input_email_main">
                            <div className="email_icon">
                                <img src="/password_icon.svg" alt="" />
                            </div>
                            <div className="input_type_email">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password..."
                                    name="password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    required
                                />
                            </div>
                            <div
                                className="show_password_icon"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <img
                                    src={
                                        showPassword
                                            ? "/showPassword_icon.svg"
                                            : "/hide_Password.svg"
                                    }
                                    alt="Toggle password visibility"
                                />
                            </div>
                        </div>

                        <div className="login_button_form">
                            <button type="submit">Login</button>
                        </div>

                        <div className="reset_password">
                            <p>
                                Forgot Password?
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsPopupOpen(false);
                                        setIsForgotOpen(true);
                                    }}
                                >
                                    Reset
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            )}

            {isResetOpen && (
                <form className="popup_overlay" onSubmit={handleResetSubmit}>
                    <div className="popup">
                        <div className="login_heading_main">
                            <div className="heading_title">
                                <p>Change Your Password</p>
                            </div>
                            <div className="close_icon" onClick={() => setIsResetOpen(false)}>
                                <img src="/x-close.svg" alt="" />
                            </div>
                        </div>

                        <label className="label_for_email">Current Password</label>
                        <div className="input_email_main">
                            <div className="email_icon">
                                <img src="/password_icon.svg" alt="" />
                            </div>
                            <div className="input_type_email">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password..."
                                    name="currentPassword"
                                    onChange={handleResetChange}
                                    value={resetFormData.currentPassword}
                                    required
                                />
                            </div>
                            <div
                                className="show_password_icon"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                            >
                                <img
                                    src={
                                        showCurrentPassword
                                            ? "/showPassword_icon.svg"
                                            : "/hide_Password.svg"
                                    }
                                    alt="Toggle current password visibility"
                                />
                            </div>
                        </div>

                        <label className="label_for_email">New Password</label>
                        <div className="input_email_main">
                            <div className="email_icon">
                                <img src="/password_icon.svg" alt="" />
                            </div>
                            <div className="input_type_email">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password..."
                                    name="newPassword"
                                    onChange={handleResetChange}
                                    value={resetFormData.newPassword}
                                    required
                                />
                            </div>
                            <div
                                className="show_password_icon"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                            >
                                <img
                                    src={
                                        showNewPassword
                                            ? "/showPassword_icon.svg"
                                            : "/hide_Password.svg"
                                    }
                                    alt="Toggle new password visibility"
                                />
                            </div>
                        </div>

                        <label className="label_for_email">Confirm Password</label>
                        <div className="input_email_main">
                            <div className="email_icon">
                                <img src="/password_icon.svg" alt="" />
                            </div>
                            <div className="input_type_email">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password..."
                                    name="confirmPassword"
                                    onChange={handleResetChange}
                                    value={resetFormData.confirmPassword}
                                    required
                                />
                            </div>
                            <div
                                className="show_password_icon"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                <img
                                    src={
                                        showConfirmPassword
                                            ? "/showPassword_icon.svg"
                                            : "/hide_Password.svg"
                                    }
                                    alt="Toggle confirm password visibility"
                                />
                            </div>
                        </div>

                        <div className="login_button_form">
                            <button type="submit">Change Password</button>
                        </div>
                    </div>
                </form>
            )}

            {isForgotOpen && (
                <form className="popup_overlay" onSubmit={handleForgotSubmit}>
                    <div className="popup">
                        <div className="login_heading_main">
                            <div className="heading_title">
                                <p>Forgot Password</p>
                            </div>
                            <div
                                className="close_icon"
                                onClick={() => {
                                    setIsForgotOpen(false);
                                    setStep(1);
                                    setForgotData({ email: "", otp: "", newPassword: "", confirmPassword: "" });
                                    setOtpTimer(0);
                                }}
                            >
                                <img src="/x-close.svg" alt="" />
                            </div>
                        </div>

                        {step === 1 && (
                            <>
                                <label className="label_for_email">Email Address</label>
                                <div className="input_email_main">
                                    <div className="email_icon">
                                        <img src="/email_icon.svg" alt="" />
                                    </div>
                                    <div className="input_type_email">
                                        <input
                                            type="email"
                                            placeholder="Enter your email..."
                                            name="email"
                                            onChange={handleForgotChange}
                                            value={forgotData.email}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="login_button_form">
                                    <button type="submit" disabled={loading}>
                                        {loading ? "Sending..." : "Send OTP"}
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <label className="label_for_email">Enter OTP</label>
                                <div className="input_email_main">
                                    <div className="email_icon">
                                        <img src="/password_icon.svg" alt="" />
                                    </div>
                                    <div className="input_type_email">
                                        <input
                                            type="number"
                                            placeholder="Enter OTP..."
                                            name="otp"
                                            onChange={handleForgotChange}
                                            value={forgotData.otp}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="login_button_form">
                                    <button type="submit" disabled={loading}>
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <label className="label_for_email">New Password</label>
                                <div className="input_email_main">
                                    <div className="email_icon">
                                        <img src="/password_icon.svg" alt="" />
                                    </div>
                                    <div className="input_type_email">
                                        <input
                                            type={showForgotNewPassword ? "text" : "password"}
                                            placeholder="Enter new password..."
                                            name="newPassword"
                                            onChange={handleForgotChange}
                                            value={forgotData.newPassword}
                                            required
                                        />
                                    </div>
                                    <div
                                        className="show_password_icon"
                                        onClick={() => setShowForgotNewPassword((prev) => !prev)}
                                    >
                                        <img
                                            src={
                                                showForgotNewPassword
                                                    ? "/showPassword_icon.svg"
                                                    : "/hide_Password.svg"
                                            }
                                            alt="Toggle new password visibility"
                                        />
                                    </div>
                                </div>

                                <label className="label_for_email">Confirm Password</label>
                                <div className="input_email_main">
                                    <div className="email_icon">
                                        <img src="/password_icon.svg" alt="" />
                                    </div>
                                    <div className="input_type_email">
                                        <input
                                            type={showForgotConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password..."
                                            name="confirmPassword"
                                            onChange={handleForgotChange}
                                            value={forgotData.confirmPassword}
                                            required
                                        />
                                    </div>
                                    <div
                                        className="show_password_icon"
                                        onClick={() => setShowForgotConfirmPassword((prev) => !prev)}
                                    >
                                        <img
                                            src={
                                                showForgotConfirmPassword
                                                    ? "/showPassword_icon.svg"
                                                    : "/hide_Password.svg"
                                            }
                                            alt="Toggle confirm password visibility"
                                        />
                                    </div>
                                </div>

                                <div className="login_button_form">
                                    <button type="submit" disabled={loading}>
                                        {loading ? "Updating..." : "Change Password"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </form>

            )}
        </>
    );
});

export default Navbar;