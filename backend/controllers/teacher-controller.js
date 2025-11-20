const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');
const department = require("../models/departmentSchema.js");

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSubject, teachSclass, department } = req.body;
    //console.log('req.body', req.body);
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const teacher = new Teacher({ name, email, password: hashedPass, role, school, teachSubject, teachSclass, department });

        const existingTeacherByEmail = await Teacher.findOne({ email });

        if (existingTeacherByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else {
            let result = await teacher.save();
            await Subject.findByIdAndUpdate(teachSubject, { teacher: teacher._id });
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    console.log('req.body', req.body);
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            //console.log('validated', validated);
            if (validated) {
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")
                teacher = await teacher.populate("department", "departmentName")
                teacher.password = undefined;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        const schoolId = req.params.id;
       // console.log('schhool', schoolId);
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(schoolId)) {
            return res.status(400).json({ message: "Invalid school ID format" });
        }

        const teachers = await Teacher.find({ school: schoolId })
            .populate("teachSubject", "subName sessions")
            .populate("teachSclass", "sclassName")
            .populate("department", "departmentName");
        //console.log('teachers', teachers)
        const modifiedTeachers = teachers.map((teacher) => ({ ...teacher._doc, password: undefined }));
        res.send(modifiedTeachers); // will send [] if empty
    } catch (err) {
        console.error("Error fetching teachers:", err);
        res.status(500).json({ message: "Server error while fetching teachers" });
    }
};


const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName")

        if (teacher) {
            teacher.password = undefined;
            res.send(teacher);
        }
        else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );

        await Subject.findByIdAndUpdate(teachSubject, { teacher: updatedTeacher._id });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!deletedTeacher) {
            return res.status(404).send({ message: "Teacher not found" });
        }
        await Subject.updateOne(
            { teacher: deletedTeacher._id },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const teachersToDelete = await Teacher.find({ school: req.params.id });

        if (!teachersToDelete.length) {
            return res.send({ message: "No teachers found to delete" });
        }

        await Subject.updateMany(
            { teacher: { $in: teachersToDelete.map(t => t._id) } },
            { $unset: { teacher: 1 } }
        );

        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const teachersToDelete = await Teacher.find({ sclassName: req.params.id });

        if (!teachersToDelete.length) {
            return res.send({ message: "No teachers found to delete" });
        }

        await Subject.updateMany(
            { teacher: { $in: teachersToDelete.map(t => t._id) } },
            { $unset: { teacher: 1 } }
        );

        const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};