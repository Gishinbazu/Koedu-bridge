// src/controllers/program.controller.ts
import { Request, Response } from "express";
import Program from "../models/Program.model"; // adapte le nom du modèle si différent

// GET /api/programs
export const getPrograms = async (_req: Request, res: Response) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// GET /api/programs/:id
export const getProgramById = async (req: Request, res: Response) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json(program);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// POST /api/programs
export const createProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// PUT /api/programs/:id
export const updateProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json(program);
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// DELETE /api/programs/:id
export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({ message: "Program deleted" });
  } catch (e: any) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};
