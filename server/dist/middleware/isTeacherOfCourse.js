import Course from "../models/course-model.js";
// Middleware: 檢查使用者是否為該課程老師
export const isTeacherOfCourse = async (req, res, next) => {
    try {
        const user = req.user;
        const courseId = req.params.courseId || req.params.id;
        if (!user || user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "只有老師可以執行此操作",
            });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "課程不存在",
            });
        }
        if (course.teacher.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "你不是此課程的老師，無權限操作",
            });
        }
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "伺服器錯誤",
        });
    }
};
//# sourceMappingURL=isTeacherOfCourse.js.map