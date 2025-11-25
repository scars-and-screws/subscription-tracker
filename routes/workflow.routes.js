import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";

const workflowRouter = Router();

// Route to trigger workflow execution
workflowRouter.post("/subscription/reminder", sendReminders);

export default workflowRouter;
