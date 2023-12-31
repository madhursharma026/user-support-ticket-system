import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import HeaderNav from './components/Header';
import { useMutation } from '@apollo/client';
import styles from '../styles/Payment/payment.module.css';
import { FindPaymentHistory, FindTotalAmount, createPaymentUsingRazorpay } from './api/graphqlAPI';
import { Table } from 'react-bootstrap';

export default function RazorpayPayment() {

    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [amount, setAmount] = useState("");
    const [alertData, setAlertData] = useState(false);
    const [alertDataBG, setAlertDataBG] = useState('');
    const [totalAmount, setTotalAmount] = useState([]);
    const [showAlertData, setshowAlertData] = useState("");
    const [paymentHistory, setpaymentHistory] = useState([]);
    const handleClose = () => (setShow(false), setAmount(''));
    const [Find_Total_Amount] = useMutation(FindTotalAmount);
    const [Get_Payment_History] = useMutation(FindPaymentHistory);
    const [Create_Payment_Using_Razorpay] = useMutation(createPaymentUsingRazorpay);

    async function handleSubmit(amount) {
        if (amount === "") {
            alert("please enter amount");
        } else {
            try {
                let LoginUserId = (localStorage.getItem('supportTicketLoginUserId'))
                const response = await fetch(`/api/createOrder?amount=${amount}`);
                const order = await response.json();
                var options = {
                    "key": "rzp_test_Y61kRqzXtbFeOL", // Enter the Key ID generated from the Dashboard 
                    "currency": "INR",
                    "name": "Testing Project",
                    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Indian_Rupee_symbol.svg/640px-Indian_Rupee_symbol.svg.png",
                    "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                    "handler": async function (response) {
                        // alert('Payment Id: ' + response.razorpay_payment_id);
                        await Create_Payment_Using_Razorpay({
                            variables: {
                                createRazorpayArgs: {
                                    order_id: order.id,
                                    amount: amount,
                                    user_id: LoginUserId
                                }
                            }
                        })
                            .then(async (res) => {
                                setAlertData(true)
                                setAlertDataBG('success')
                                setshowAlertData('Payment Added Successfully!')
                            })
                            .catch(error => {
                                setAlertData(true)
                                setAlertDataBG('danger')
                                setshowAlertData(error?.message)
                            });
                        handleClose()
                        setAmount('')
                    },
                    "theme": {
                        "color": "#3399cc"
                    }
                };
                var rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    // alert(response.error.reason);
                    setAlertData(true)
                    setAlertDataBG('danger')
                    setshowAlertData(response.error.reason)
                });
                rzp1.open();
            } catch (error) {
                // console.error('Error creating order:', error);
                setAlertData(true)
                setAlertDataBG('danger')
                setshowAlertData(error)
            }
        }
    }

    async function getPaymentHistory() {
        let LoginUserId = (localStorage.getItem('supportTicketLoginUserId'))
        await Get_Payment_History({
            variables: {
                findPaymentHistoryId: LoginUserId
            }
        })
            .then(async res => {
                setpaymentHistory(res.data.findPaymentHistory)
                await Find_Total_Amount({ variables: { findOneByIdId: LoginUserId } }).then((res) => { setTotalAmount(res.data.findTotalAmount) })
            })
            .catch(err => {
                setAlertData(true)
                setAlertDataBG('danger')
                setshowAlertData(err?.message)
            });
    };

    useEffect(() => {
        getPaymentHistory()
    }, []);

    useEffect(() => {
        setTimeout(function () {
            if (alertData === true) {
                setAlertData(false)
                getPaymentHistory()
            }
        }, 1000);
    },)

    return (
        <div style={{ minHeight: '100vh' }}>
            {alertData ?
                <div className={`alert alert-${alertDataBG} mb-0`} role="alert">
                    {showAlertData}
                </div>
                :
                <></>
            }
            <HeaderNav pageName='razorpayPayment' />
            <div className={`${styles.ContainerWidth} px-3`}>
                <div className="text-center mt-3">
                    <h1>Your Fund: ₹ {totalAmount.reduce((sum, item) => sum + parseFloat(item.amount), 0)}</h1>
                    <button type="button" class="btn btn-success" onClick={handleShow}>Add Money</button>
                </div>
                {paymentHistory.length !== 0 ?
                    <>
                        <h2 className='mt-3'>Your Payment History:</h2>
                        <Table striped bordered hover variant="light" className='mt-3 text-center'>
                            <thead>
                                <tr>
                                    <th className='p-3 fs-5'>Id</th>
                                    <th className='p-3 fs-5'>Order Is</th>
                                    <th className='p-3 fs-5'>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((paymentHistory, index) => (
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>{index + 1}</td>
                                        <td style={{ fontWeight: 'bold' }}>{paymentHistory.order_id}</td>
                                        <td style={{ fontWeight: 'bold' }}>{paymentHistory.amount}</td>
                                        {/* {amounts.reduce((sum, item) => sum + parseFloat(item.amount), 0)} */}

                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                    :
                    <>
                        <h4 className='text-center mt-4'>------------------------------</h4>
                        <h4 className='text-center mt-4'>No Transaction Found</h4>
                        <h4 className='text-center mt-4'>------------------------------</h4>
                    </>
                }
            </div>
            <Modal show={show} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add Money</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="mb-3">
                        <label for="money" class="form-label">Money</label>
                        <input type="number" class="form-control" id="money" autoComplete='off' onChange={(e) => setAmount(e.target.value)} value={amount} min={1} />
                    </div>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleSubmit(amount)}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </Modal>
        </div>
    )
}

