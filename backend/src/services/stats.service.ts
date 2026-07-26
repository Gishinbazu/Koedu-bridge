import { Application } from "../models/Application";
import { Program } from "../models/Program";
import { User } from "../models/User";

export const getDashboardStats = async () => {
  const [students, managers, programs, applications] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "manager" }),
    Program.countDocuments({}),
    Application.countDocuments({})
  ]);

  return {
    totalStudents: students,
    totalManagers: managers,
    totalPrograms: programs,
    totalApplications: applications
  };
};
