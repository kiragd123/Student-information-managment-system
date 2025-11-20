const Sclass= require("../models/sclassSchema");
const Department = require("../models/departmentSchema");
const Subject = require("../models/subjectSchema");
const Teacher = require("../models/teacherSchema");
const Student=require("../models/studentSchema")

const createDepartment = async (req, res) => {
    try {
        const { departmentName, adminID, sclassName } = req.body;

        // ✅ Validate input
        if (!departmentName || !adminID) {
            return res.status(400).json({ message: "Department name and adminID are required" });
        }

        // ✅ Check for duplicates (same name under same school)
        const existingDepartment = await Department.findOne({
            departmentName,
            school: adminID,
        });

        if (existingDepartment) {
            return res.status(400).json({ message: "This department already exists" });
        }

        // ✅ Create the department
        const department = new Department({
            departmentName,
            school: adminID,
        });

        const savedDepartment = await department.save();

        // ✅ If an initial class name is provided, create and link it
        if (sclassName) {
            const newClass = new Sclass({
                sclassName,
                department: savedDepartment._id,
                school: adminID,
            });

            const savedClass = await newClass.save();

            // Add class reference to department
            savedDepartment.teachClass.push(savedClass._id);
            await savedDepartment.save();
        }

        // ✅ Populate and return clean data
        const populatedDepartment = await Department.findById(savedDepartment._id)
            .populate("teachClass", "sclassName")
            .populate("subjects", "subName")
            .populate("teachers", "name");

        res.status(201).json(populatedDepartment);

    } catch (err) {
        console.error("Error creating department:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


const departmentList = async (req, res) => {
    try {
        console.log('req.params', req.params)
        let departments = await Department.find({ school: req.params.id })
            .populate('teachClass', 'sclassName')
             .populate('subjects', 'subName')
             .populate('teachers', 'name')     
        //console.log(departments)

        if (departments.length > 0) {
            res.send(departments)
        } else {
            res.send({ message: "No departments found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }   
}
const getDepartmentDetail = async (req, res) => {
    try {
        let department = await Department.findById(req.params.id);
        if (department) {
            department = await department.populate("school", "schoolName")
            res.send(department);
        }
        else {
            res.send({ message: "No department found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}
const assignSubjectToDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const subjectId = req.body.subjectId;
        const department = await Department.findById(departmentId);
        const subject = await Subject.findById(subjectId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        if (department.subjects.includes(subjectId)) {
            return res.status(400).json({ message: 'Subject already assigned to this department' });
        }
        department.subjects.push(subjectId);
        await department.save();
        res.status(200).json({ message: 'Subject assigned to department successfully', department });
    } catch (err) {
        res.status(500).json(err);
    }
}
const assignTeacherToDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const teacherId = req.body.teacherId;
        const department = await Department.findById(departmentId);
        const teacher = await Teacher.findById(teacherId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        if (department.teachers.includes(teacherId)) {
            return res.status(400).json({ message: 'Teacher already assigned to this department' });
        }
        department.teachers.push(teacherId);
        await department.save();
        res.status(200).json({ message: 'Teacher assigned to department successfully', department });
    } catch (err) {
        res.status(500).json(err);
    }
}
const assignClassToDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const classId = req.body.classId;
        const department = await Department.findById(departmentId);
        const sclass = await sclass.findById(classId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        if (!sclass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        if (department.teachClass.includes(classId)) {
            return res.status(400).json({ message: 'Class already assigned to this department' });
        }
        department.teachClass.push(classId);
        await department.save();
        res.status(200).json({ message: 'Class assigned to department successfully', department });
    } catch (err) {
        res.status(500).json(err);
    }
}
const assignStudentToDepartment = async (req, res) => {
    try {
        const departmentId = req.params.id;
        const studentId = req.body.studentId;
        const department = await Department.findById(departmentId);
        const student = await Student.findById(studentId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (department.students.includes(studentId)) {
            return res.status(400).json({ message: 'Student already assigned to this department' });
        }
        department.students.push(studentId);
        await department.save();
        res.status(200).json({ message: 'Student assigned to department successfully', department });
    } catch (err) {
        res.status(500).json(err);
    }
}
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting Department:", id);

    // 1️⃣ Check if department exists
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // 2️⃣ Delete related records
    await Student.deleteMany({ department: id });
    await Subject.deleteMany({ department: id });
    await Teacher.deleteMany({ department: id });
    await Sclass.deleteMany({ department: id });

    // 3️⃣ Delete department itself
    await Department.findByIdAndDelete(id);

    // 4️⃣ Respond success
    res.status(200).json({ message: "Department and related data deleted successfully." });

  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Server error while deleting department", error: error.message });
  }
};

module.exports = {
    createDepartment,
    departmentList,
    getDepartmentDetail,
    assignSubjectToDepartment,
    assignTeacherToDepartment,
    assignClassToDepartment,
    assignStudentToDepartment,
    deleteDepartment
}
        
        