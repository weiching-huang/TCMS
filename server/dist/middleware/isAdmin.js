export const isAdmin = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "沒有權限操作"
        });
    }
    next();
};
//# sourceMappingURL=isAdmin.js.map