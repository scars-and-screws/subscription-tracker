import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: { subscriptionId: subscription._id },

      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res
      .status(201)
      .json({ success: true, data: { subscription, workflowRunId } });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the authenticated user is requesting their own subscriptions which is done by comparing req.user.id and req.params.userId which is in token
    if (req.user.id !== req.params.userId) {
      const error = new Error(
        "Forbidden: You can only access your own subscriptions"
      );
      error.statusCode = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.userId });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, message: "Subscription deleted" });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const upcomingRenewals = await Subscription.find({
      renewalDate: { $gt: new Date() },
      status: "active",
    });

    res.status(200).json({ success: true, data: upcomingRenewals });
  } catch (error) {
    next(error);
  }
};
