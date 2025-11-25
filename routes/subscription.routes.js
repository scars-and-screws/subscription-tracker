import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscriptionDetails,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

//  Route to get all subscriptions
subscriptionRouter.get("/", getAllSubscriptions);

// Route to upcoming-renewals a subscription
subscriptionRouter.get("/upcoming-renewals", getUpcomingRenewals);

//  Route to get single subscription details
subscriptionRouter.get("/:id", getSubscriptionDetails);

export default subscriptionRouter;
