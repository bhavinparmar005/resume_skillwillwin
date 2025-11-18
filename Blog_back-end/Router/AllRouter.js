const express = require("express");
const router = express.Router();
const blogTbl = require("../Controller/blog_Controller");
const schoolTbl = require("../Controller/add_School_Controller");
const adminTbl = require("../Controller/admin_controller");
const multer = require("multer");

// Cloudinary config import
const { storage } = require("../Config/Cloudinary"); // ✅ storage import karo

// Multer setup
const upload = multer({ storage });

// ===================== School & Student ===================== //
router.get("/totalstudentandschools", schoolTbl.totalstudentandschools);

// ===================== Blog Routes ===================== //
router.get("/", blogTbl.startServer); // server start
router.post("/addblog", upload.single("image"), blogTbl.addblog); // add Blog
router.post("/updateblog/:id", upload.single("image"), blogTbl.updatablog); // update Blog
router.get("/allblog", blogTbl.allblog); // get all Blog
router.get("/deleteblog/:id", blogTbl.deleteblog); // delete one blog

// ===================== School Routes ===================== //
router.post("/addschool", schoolTbl.addschool); // add new school
router.post("/editschool/:id", schoolTbl.editschool); // edit school data
router.get("/deleteschool/:id", schoolTbl.deleteschool); // delete school data
router.get("/allschool", schoolTbl.allschool); // get all school data

router.post("/schoollogin", schoolTbl.schoolLogin); // login school authentication
router.post("/schoolforgetpassword", schoolTbl.schoolForgetPassword); // school Forget Password
router.post("/checkotp", schoolTbl.checkotp); // check otp
router.post("/schoolupdatepassword", schoolTbl.schoolPasswordUpdate); // school Update Password
router.post("/schoolresetpassword", schoolTbl.schoolResetPassword); // school reset Password

// ===================== Admin Routes ===================== //
router.post("/addAdmin", adminTbl.addadmin); // add admin
router.post("/adminlogin", adminTbl.adminLogin); // login Admin authentication
router.post("/adminforgetpassword", adminTbl.adminForgetPassword); // Admin Forget Password
router.post("/admincheckotp", adminTbl.admincheckotp); // Admin check OPT For forgate Password
router.post("/adminupdatepassword", adminTbl.adminPasswordUpdate); // Admin Update Password
router.post("/adminresetpassword", adminTbl.adminResetPassword); // Admin reset Password

module.exports = route;
