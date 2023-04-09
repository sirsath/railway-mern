const { registerEmployee, getAllEmployees, getSingleEmployees, updateEmployees, deleteEmployees, destroyEmployees, getEmployeeProfile, adminGetAllProducts, adminDeleteAllProducts, adminGetAllUsers, adminUserStatus, getUserByadminOrder, adminstat, adminSerch } = require("../controllers/employeeController")
const { adminProtected } = require("../middleware/auth")
const router = require("express").Router()

router
    // .get("/", getAllEmployees) 
    // .get("/profile", adminProtected, getEmployeeProfile)
    // .get("/admin-products", adminProtected, adminGetAllProducts)
    // .delete("/admin-delete", adminDeleteAllProducts)
    // .get("/detail/:employeeId", getSingleEmployees)
    // .post("/register", registerEmployee)
    // .put("/update/:employeeId", updateEmployees)
    // .delete("/delete/:employeeId", deleteEmployees)
    // .delete("/destroy", destroyEmployees)
    // .get("/", getAllEmployees) 
    .get("/profile", getEmployeeProfile)
    .get("/admin-products", adminGetAllProducts)
    .delete("/admin-delete", adminDeleteAllProducts)
    .get("/detail/:employeeId", getSingleEmployees)
    .post("/register", registerEmployee)
    .put("/update/:employeeId", updateEmployees)
    .delete("/delete/:employeeId", deleteEmployees)
    .delete("/destroy", destroyEmployees)


    // User 
    .get("/admin-user", adminGetAllUsers)
    .get("/admin-orderhistory/:userId", getUserByadminOrder)
    .put("/status/:userId", adminUserStatus)
    .get("/serch-user", adminSerch)
    

    //   Dashbord 
    .get("/stat", adminstat)

module.exports = router