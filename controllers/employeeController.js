const Employee = require("./../models/Employee")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const { sendEmail } = require("../utils/email")
const Product = require("../models/Product")
const User = require("./../models/User")
const Order = require("../models/Order")

exports.registerEmployee = asyncHandler(async (req, res) => {
    const { name, password, email } = req.body
    if (!name || !password || !email) {
        return res.status(400).json({
            message: "all feilds required"
        })
    }
    const duplicate = await Employee.findOne({ email })
    if (duplicate) {
        return res.status(400).json({
            message: "email alredy exist"
        })
    }

    const hashPass = bcrypt.hashSync(password, 10)
    const result = await Employee.create({
        ...req.body,
        password: hashPass,
        role: "intern"
    }
    )
    sendEmail({
        sendTo: email,
        sub: "hi sweety",
        msg: "hiii welcome .... "
    })
    res.json({
        message: "employee created successfully"
    })
})

exports.getAllEmployees = asyncHandler(async (req, res) => {
    const result = await Employee.find()
    res.json({
        message: " All employee fetched success",
        result: {
            count: result.length,
            data: result
        }
    })
})

exports.getEmployeeProfile = asyncHandler(async (req, res) => {
    console.log(req.cookies);
    // const result = await Employee.find()
    res.json({
        message: " All employee fetched success",

    })
})
exports.getSingleEmployees = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const result = await Employee.findById(employeeId)
    if (!result) {
        return res.status(400).json({
            message: "invalid user id"
        })
    }
    res.json({
        message: " single employee  fetchd success",
        result: {
            count: result.length,
            data: result
        }
    })
})
exports.updateEmployees = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const result = await Employee.findById(employeeId)
    if (!result) {
        return res.status(400).json({
            message: "invalid user id"
        })
    }
    const { password, email } = req.body
    if (password) {
        return res.status(400).json({
            message: "can not change password"
        })
    }
    if (email) {
        const duplicate = await Employee.findOne({ email })
        if (duplicate) {
            return res.status(400).json({
                message: "duplicate email"
            })
        }
    }
    await Employee.findByIdAndUpdate(employeeId, req.body)
    res.json({
        message: " update employee success",

    })
})

exports.deleteEmployees = asyncHandler(async (req, res) => {
    const { employeeId } = req.params
    const result = await Employee.findOne({ _id: employeeId })
    if (!result) {
        return res.status(400).json({
            message: "invalid user id"
        })
    }
    await Employee.findByIdAndDelete(employeeId)
    res.json({
        message: " delete employee success"
    })
})
exports.destroyEmployees = asyncHandler(async (req, res) => {
    await Employee.deleteMany()
    res.json({
        message: " all employee  deleted success"
    })
})

exports.adminGetAllProducts = asyncHandler(async (req, res) => {
    const result = await Product.find().select("-employeeId -createdAt -updatedAt -__v")
    console.log(result, "res")
    res.json({
        message: " All product fetchd success",
        result
    })
})
exports.adminDeleteAllProducts = asyncHandler(async (req, res) => {
    const result = await Product.deleteMany().select("-employeeId -createdAt -updatedAt -__v")
    console.log(result, "res")
    res.json({
        message: "Admin Product Delete success",
        result
    })
})

// User Controller --------------- 

exports.adminGetAllUsers = asyncHandler(async (req, res) => {
    const result = await User.find().select("-employeeId -createdAt -updatedAt -__v")
    console.log(result, "res")
    res.json({
        message: " Admin :  All User fetchd success",
        result
    })
})
exports.adminUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const result = await User.findByIdAndUpdate(userId, {
        active: req.body.active
    }).select("-employeeId -createdAt -updatedAt -__v")

    res.json({
        message: `User ${req.body.active ? "Un Blocked" : "Block"} Success `,
    })
})
exports.getUserByadminOrder = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!userId) {
        res.json({
            message: "Invalid User Id",
        })
    }
    const result = await Order.find({ userId }).populate("products.productId")
        .select("-createdAt -updatedAt -__v")
    console.log(result);
    res.json({
        message: `Admin :- User Order Fetched Successfuly ${userId}`,
        result
    })
})
//  Dashbord 

exports.adminstat = asyncHandler(async (req, res) => {
    const Users = await User.countDocuments()
    const ActiveUser = await User.countDocuments({ active: true })
    const inActiveUser = await User.countDocuments({ active: false })

    const Products = await Product.countDocuments()
    const PublichProducts = await Product.countDocuments({ publish: true })
    const UnPublishProducts = await Product.countDocuments({ publish: false })

    const Orders = await Order.countDocuments()
    const DiliveredOrders = await Order.countDocuments({ orderStatus: "delivered" })
    const PaidOrders = await Order.countDocuments({ paymentStatus: "paid" })
    const CodOrders = await Order.countDocuments({ paymentmethod: "cod" })
    const OnlineOrders = await Order.countDocuments({ paymentMode: "online" })
    const CanceleOrders = await Order.countDocuments({ orderStatus: "cancel" })

    res.json({
        message: "All Info Get SuccsessFully",
        result: {
            Users,
            ActiveUser,
            inActiveUser,
            Products,
            PublichProducts,
            UnPublishProducts,
            Orders,
            DiliveredOrders,
            PaidOrders,
            CodOrders,
            OnlineOrders,
            CanceleOrders
        }
    })
})