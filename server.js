const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Aryan Computer Server is Running ✅"
    });
});

app.post("/create-order", async (req, res) => {
    try {
        const amount = Number(req.body.amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                error: "Invalid amount"
            });
        }

        const Razorpay = require("razorpay");

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "AC_" + Date.now()
        });

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Order create nahi ho saka"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Aryan Computer Server running on http://localhost:${PORT}`
    );
});