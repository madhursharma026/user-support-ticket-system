import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from '../styles/Payment/payment.module.css';
import Link from 'next/link'; import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HeaderNav from './components/Header';

export default function InvoiceFormate() {

    const router = useRouter();
    const [loader, setLoader] = useState(false);

    function downloadPDF() {
        const capture = document.querySelector('.actual_receipt');
        setLoader(true);
        html2canvas(capture).then((canvas) => {
            const imgData = canvas.toDataURL('img/png');
            const doc = new jsPDF('p', 'mm', 'a4');
            const componentWidth = doc.internal.pageSize.getWidth() - 10;
            const componentHeight = doc.internal.pageSize.getHeight() / 2;
            doc.addImage(imgData, 'PNG', 5, 5, componentWidth, componentHeight);
            setLoader(false);
            doc.save('receipt.pdf');
            router.push('/razorpayPayment');
        })
    }

    return (
        <>
            <HeaderNav pageName='razorpayPayment' />
            <div className={styles.wrapper}>
                <div className={styles.receipt_box}>
                    <div className={`${styles.actual_receipt} actual_receipt`}>
                        <h1><b>Comapny Name</b></h1>
                        <h5>Company Address{' - '}PINCODE</h5>
                        <h5 className='row'>
                            <div className="col-6">
                                Mobile: 9876543210
                            </div>
                            <div className="col-6">
                                <Link href='#' style={{ textAlign: 'right' }}>
                                    testingemail123@gmail.com
                                </Link>
                            </div>
                        </h5>
                        <div className={styles.colored_row}>
                            <b>Payment Method</b>
                            <b>Card Number</b>
                        </div>
                        <div className={styles.data_row}>
                            <b>CREDIT</b>
                            <span>************4444</span>
                        </div>
                        <div className={styles.colored_row}>
                            <b>Campaign</b>
                            <b>Amount</b>
                        </div>
                        <div className={styles.data_row}>
                            <b>Dollar a Day for Sadaqa</b>
                            <span>₹{' '}{router.query.amount}</span>
                        </div>
                        <div className={styles.colored_row}>
                            <b>Transaction Details - Donations</b>
                        </div>
                        <div className={styles.data_row}>
                            <span><b>MID:</b>{' '}1234567</span>
                            <span><b>Sequence{' '}#:</b>{' '}SSSSSSSS</span>
                        </div>

                        <div className={styles.data_row}>
                            <span><b>Invoice{' '}#:</b>{' '}AX1234ZVB5671234</span>
                            <span><b>Created{' '}:</b>{' '}2023-02-14 02:21:37</span>
                        </div>
                        <div className={styles.data_row}>
                            <span><b>Authentication{' '}#:</b>{' '}TEST</span>
                            <span><b>Batch{' '}#:</b>{' '}1234</span>
                        </div>
                        <div className={styles.data_row}>
                            <b>Transaction:{' '}APPROVED - 00</b>
                            <span />
                        </div>
                        <div className={styles.colored_row}>
                            <span>Thank You For Your Generous Donation</span>
                            <span />
                        </div>
                    </div>
                    <div className="text-center p-3">
                        <button className={styles.receipt_modal_download_button} onClick={() => downloadPDF()} disabled={!(loader === false)}>
                            {loader ? (
                                <span>Downloading</span>
                            ) : (
                                <span>Download</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

