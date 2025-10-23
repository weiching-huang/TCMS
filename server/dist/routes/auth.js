import express, { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user-model.js";
import { isAdmin } from "../middleware/isAdmin.js";
const router = express.Router();
router.post("/register", passport.authenticate("jwt", { session: false }), isAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email已經存在" });
        }
        const newUser = new User({
            name,
            email,
            password,
            role,
        });
        await newUser.save();
        res.status(201).json({ message: "使用者註冊成功!!", user: newUser, });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "註冊時伺服器錯誤!" });
    }
});
router.post("/login", async (req, res) => {
    // const { error } = loginValidation(req.body);
    // if (error) {
    //   return res.status(400).send(error.details[0].message);
    // }
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("沒有這個會員!!");
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send("錯誤的密碼!!");
        }
        const tokenObject = { _id: user._id, email: user.email, role: user.role };
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, {
            expiresIn: "2h",
        });
        res.send({
            success: true,
            token: `${token}`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("登入伺服器錯誤");
    }
});
router.get("/me", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "找不到使用者" });
        }
        const { _id, name, email, role } = user;
        return res.json({
            success: true,
            user: {
                _id,
                name,
                email,
                role,
            },
        });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: "伺服器錯誤" });
    }
});
export default router;
//# sourceMappingURL=auth.js.map