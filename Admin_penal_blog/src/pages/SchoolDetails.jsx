import React, { useActionState, useEffect, useState } from 'react'
import AdminNavbar from '../components/AdminNavbar'
import { Plus, Pencil, Trash } from "react-bootstrap-icons";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios, { all } from 'axios';
import Swal from 'sweetalert2';

const SchoolDetails = () => {

    let nav = useNavigate()
    const [loading, setLoading] = useState(true);
    const [schoolData, setSchoolData] = useState([]);
    const [searchdata, setSerchData] = useState("");
    const [allstudent, setAllstudent] = useState("")

    const getallstudent = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/totalstudentandschools`);
            setAllstudent(res.data)



        } catch (error) {
            console.error("❌ Backend not running:", error.message);
        }

    }

    useEffect(() => {
        getallstudent()
        getschoolData()
        let token = localStorage.getItem("adminToken")
        let admin = JSON.parse(localStorage.getItem("name"))
        if (!token && !admin) {
            nav("/")
        }
    }, [])



    const getschoolData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/allschool`);
            setSchoolData(res.data.data || []); // ✅ Agar data empty ho to bhi array set
        } catch (error) {
            console.error("❌ Backend not running:", error.message);
            setSchoolData([]);
        } finally {
            setLoading(false); // ✅ loader hamesha band ho jaye
        }
    };


    
    const filteredData = schoolData.filter((school) => {
        const query = searchdata.toLowerCase();


        return (
            school.schoolname.toLowerCase().includes(query)
            ||
            school.email.toLowerCase().includes(query)
            ||
            school.phone.toString().includes(query) ||
            school.student.toString().includes(query) ||
            school.address.toString().includes(query)
        );
    });


    const handleDelete = async (id) => {
        try {
            // Confirm alert
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2c7864",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {

                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/deleteschool/${id}`);

                // ✅ Success message
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: res.data.message || "School deleted successfully.",
                    showConfirmButton: false,
                    timer: 2000,
                });
                getschoolData();
            }
        } catch (error) {
            console.error("Delete Error:", error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Something went wrong!",
            });
        }
    };

    return (
        <>
            <AdminNavbar />
            <Container className="mt-4">
                <Row className="align-items-center">
                    {/* Left Side - Title */}
                    <Col
                        xs={12}
                        lg={3} // xl -> lg
                        className="d-flex justify-content-start align-items-center mb-2 mb-lg-0"
                    >
                        <h3 className="fw-semibold m-0">Schools</h3>
                    </Col>

                    {/* Center - Search Bar */}
                    <Col
                        xs={12}
                        lg={6} // xl -> lg
                        className="d-flex justify-content-center mb-2 mb-lg-0"
                    >
                        <Form className="w-100" style={{ maxWidth: "100%" }}>
                            <Form.Control
                                placeholder="Search school name..."
                                className="shadow-none"
                                style={{
                                    outline: "none",
                                    border: "1px solid #2c7864",
                                    borderRadius: "0.375rem",
                                    padding: "0.5rem 0.75rem",
                                }}
                                onChange={(e) => setSerchData(e.target.value)}
                            />
                        </Form>
                    </Col>

                    {/* Right Side - Button */}
                    <Col
                        xs={12}
                        lg={3} // xl -> lg
                        className="d-flex justify-content-center justify-content-lg-end align-items-center gap-2"
                    >
                        <Button
                            className="text-teal fw-semibold d-flex align-items-center justify-content-center"
                            style={{
                                minWidth: "140px",
                                backgroundColor: "#2c7864",
                                border: "none",
                                color: "#ffffff",
                                height: "42px",
                                whiteSpace: "nowrap",
                            }}
                            onClick={() => { nav("/addschool") }}
                        >
                            <Plus className="me-2 mb-1" size={25} />
                            Add School
                        </Button>
                    </Col>
                </Row>
            </Container>



            <Container>
                <div className="d-flex justify-content-center align-items-center mt-5">


                    <h5 className='fw-semibold' style={{ color: "#555353" }}>Total Students:- <span className="me-3" style={{ color: "#2c7864" }}>{allstudent.totalStudents}</span></h5>
                    <h5 className='fw-semibold' style={{ color: "#555353" }}>Total Schools:- <span style={{ color: "#2c7864" }}>{allstudent.totalSchools}</span></h5>
                </div>
                <div className="table-responsive mt-2">
                    <Table bordered hover className="align-middle">
                        <thead>
                            <tr>
                                <th className="custom-thead">No</th>
                                <th className="custom-thead">School Name</th>
                                <th className="custom-thead">Email Address</th>
                                <th className="custom-thead">Phone Number</th>
                                <th className="custom-thead">Student</th>
                                <th className="custom-thead">Address</th>
                                <th className="custom-thead">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                // Skeleton rows while loading
                                Array.from({ length: 10 }).map((_, index) => (
                                    <tr key={index}>
                                        <td><Skeleton width={30} /></td>
                                        <td><Skeleton width={120} /></td>
                                        <td><Skeleton width={180} /></td>
                                        <td><Skeleton width={120} /></td>
                                        <td><Skeleton width={80} /></td>
                                        <td><Skeleton width={200} /></td>
                                        <td>
                                            <Skeleton circle width={32} height={32} inline={true} style={{ marginRight: "8px" }} />
                                            <Skeleton circle width={32} height={32} inline={true} />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredData.length === 0 ? (
                                // Data not found case
                                <tr>
                                    <td colSpan="7" className="text-center text-danger fw-bold py-4">
                                        🚫 Data Not Found
                                    </td>
                                </tr>
                            ) : (
                                // Actual data rows
                                filteredData.map((school, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div style={{ cursor: "pointer" }}>
                                                {school.schoolname}
                                            </div>
                                        </td>
                                        <td>{school.email}</td>
                                        <td>{school.phone}</td>
                                        <td>{school.student}</td>
                                        <td>{school.address}</td>
                                        <td>
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "50%",
                                                    backgroundColor: " #d2d0d0ff",
                                                    color: "#555353ff",
                                                    cursor: "pointer",
                                                    marginRight: "8px",
                                                }}
                                                title="Edit"
                                                onClick={() => {
                                                    nav("/editschool", { state: school });
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </span>

                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "50%",
                                                    backgroundColor: " #d2d0d0ff",
                                                    color: "#555353ff",
                                                    cursor: "pointer",
                                                    fontWeight: "700",
                                                    marginTop: "8px",
                                                }}
                                                title="Delete"
                                                onClick={() => { handleDelete(school._id) }}
                                            >
                                                <Trash size={16} />
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>


                </div>
            </Container>

        </>
    )
}

export default SchoolDetails
