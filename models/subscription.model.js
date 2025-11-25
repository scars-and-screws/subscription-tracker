import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription Name is required"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters long"],
      maxLength: [100, "Name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Subscription Price is required"],
      min: [0, "Price must be greater than  0"],
    },
    currency: {
      type: String,
      enum: ["INR", "EUR", "GBP", "USD"],
      default: "INR",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
    category: {
      type: String,
      enum: ["entertainment", "education", "productivity", "health", "other"],
      required: [true, "Subscription Category is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment Method is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Start Date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Start Date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal Date must be after Start Date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto calculate renewalDate if missing
subscriptionSchema.pre("save", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(
      this.renewalDate.getDate() + renewalPeriods[this.frequency]
    );
  }
  // Auto update status based on current date and renewalDate
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
