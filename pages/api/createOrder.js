import { createOrder } from "./services/razorpayService";

export default async function handler(req, res) {
  try {
    const amount = Number(req.query.amount);
    const order = await createOrder(amount);
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
