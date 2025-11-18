import React, { useEffect, useState } from "react";
import {
    Form,
    Button,
    Container,
    Row,
    Col,
    InputGroup,
    Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Swal from "sweetalert2";
import axios from "axios";

const EditBlogForm = () => {
    let nav = useNavigate()

    let location = useLocation()

    let id = location.state._id
 
    useEffect(() => {
        let token = localStorage.getItem("adminToken")
        let admin = JSON.parse(localStorage.getItem("name"))
        if (!token && !admin) {
            nav("/")
        }
    }, [])




    const [imagePreview, setImagePreview] = useState(location.state?.image?.url || null);
    const [loading, setLoading] = useState(false); // 🔹 Loader state
    const [formData, setFormData] = useState({
        category: "" || location.state.category,
        image: null,
        title: "" || location.state.title,
        shortDescription: "" || location.state.shortDescription,
        description: "" || location.state.description

    });
    const modules = {
        toolbar: [
          
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image","video"],
            // ["clean"],
            [{ color: [] }, { background: [] }],
        ],
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "link",
        "video", // <-- video format only
        "image",
        "color",      // <-- Add color
        "background",
    ];



    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image" && files && files[0]) {
            const file = files[0];

            // ✅ Size check (max 1MB)
            if (file.size > 1024 * 1024) {
                Swal.fire({
                    icon: "warning",
                    title: "⚠️ File too large",
                    text: "File size should not exceed 1 MB",
                    confirmButtonColor: "#2c7864", // आपकी theme के हिसाब से
                });
                e.target.value = ""; // reset file input
                return;
            }

            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // 🔹 Loader start
        try {

            // Backend ke liye form data bana ke bhejna hoga
            const data = new FormData();
            data.append("category", formData.category);
            data.append("title", formData.title);
            data.append("shortDescription", formData.shortDescription);
            data.append("description", formData.description);
            if (formData.image) {
                data.append("image", formData.image);
            }

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/updateblog/${id}`, data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            // const res = await axios.post(
            //     `${import.meta.env.VITE_BACKEND_URL}/updateblog/${id}`,
            //     data
            // );
            setLoading(false);
            // ✅ Success Alert
            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Blog updated successfully 🎉",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                nav("/home");
            });

        } catch (error) {

            console.error("❌ Error saving blog:", error);
            setLoading(false);
            // ❌ Error Alert
            Swal.fire({
                icon: "error",
                title: "Error!",
                text:
                    error.response?.data?.message ||
                    "Failed to update Blog ❌ Please try again.",
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }



    };
    return (

        <>
            <Container
                fluid
                className="d-flex justify-content-center align-items-center pt-5 pb-5"

            >
                <Row className="w-100">
                    <Col xs={12} sm={8} md={6} lg={8} className="mx-auto">
                        <div className="login-card p-4 shadow rounded bg-white">
                            <h3 className="text-center mb-4 fw-semibold" style={{ color: "#2c7864" }}>
                                Edit Blog
                            </h3>
                            <Form onSubmit={handleSubmit}>

                                {/* Category */}
                                <Form.Group className="mb-3" controlId="category">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        name="category"
                                        className="no-focus"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Select Category --</option>
                                        <option value="Skill Will Win">Skill Will Win</option>
                                        <option value="મેં ભી ગાંધી">મેં ભી ગાંધી</option>
                                        <option value="બહાદુર બેટી">બહાદુર બેટી</option>
                                        <option value="તૈયારી જીત કી">તૈયારી જીત કી</option>
                                        <option value="લાઈફ લેશન ફ્રોમ લિજેન્ડ">
                                            લાઈફ લેશન ફ્રોમ લિજેન્ડ
                                        </option>
                                        <option value="એક્ટિવિટી કેલેન્ડર">એક્ટિવિટી કેલેન્ડર</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Image Upload */}
                                <Form.Group className="mb-3" controlId="image">
                                    <Form.Label>Upload Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        className="no-focus"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                    // required
                                    />
                                </Form.Group>
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: "100%",
                                                height: "300px",
                                                objectFit: "contain",
                                                marginTop: "10px",
                                                borderRadius: "10px",
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Title */}
                                <Form.Group className="mb-3" controlId="title">
                                    <Form.Label>Title</Form.Label>
                                    <InputGroup
                                        style={{
                                            border: "1px solid #ced4da",
                                            borderRadius: "0.375rem",
                                        }}
                                    >
                                        <Form.Control
                                            type="text"
                                            className="no-focus"
                                            placeholder="Enter blog title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            style={{ border: "none", boxShadow: "none" }}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>


                                {/* Short Description */}
                                <Form.Group className="mb-3" controlId="shortDescription">
                                    <Form.Label>Short Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        className="no-focus"
                                        rows={3}
                                        placeholder="Enter short description..."
                                        name="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>



                                {/*  Description */}
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <ReactQuill
                                        id="description"
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(content) => {
                                            setFormData((prev) => ({ ...prev, description: content }));

                                            // Auto resize logic
                                            const editorEl = document.querySelector(".ql-editor");
                                            if (editorEl) {
                                                editorEl.style.height = "auto"; // reset
                                                editorEl.style.height = editorEl.scrollHeight + "px"; // grow according to content
                                            }
                                        }}
                                        modules={modules}
                                        formats={formats}
                                        className="custom-quill"
                                    />
                                </Form.Group>

                                {/* Submit */}
                                <div className="d-grid">
                                    <Button
                                        type="submit"
                                        className="fw-semibold"
                                        style={{
                                            backgroundColor: "#2c7864",
                                            border: "none",
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                saveing...
                                            </>
                                        ) : (
                                            "Save Blog"
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default EditBlogForm