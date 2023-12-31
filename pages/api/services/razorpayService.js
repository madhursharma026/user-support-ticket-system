import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: 'rzp_test_Y61kRqzXtbFeOL',
    key_secret: 'GBGOWVhKfadlA2moIKfn70ht',
});

async function createOrder(amount) {
    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: 'order_rcptid_11',
        payment_capture: 1,
    };

    return new Promise((resolve, reject) => {
        razorpay.orders.create(options, (err, order) => {
            if (err) {
                reject(err);
            } else {
                resolve(order);
            }
        });
    });
}

module.exports = {
    createOrder,
};
