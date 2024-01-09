import moment from 'moment';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Table from 'react-bootstrap/Table';
import HeaderNav from './components/Header';
import styles from '../styles/HomeStyle/Home.module.css';
import { GetAllTicketsBySingleUser, updateStatusClosed } from './api/graphqlAPI';
import { useMutation } from '@apollo/client';

export default function TicketView() {
    const router = useRouter();
    const [alertBg, setAlertBg] = useState();
    const [showAlert, setShowAlert] = useState();
    const [allTickets, setAllTickets] = useState([]);
    const [alertData, setAlertData] = useState(false);
    const [alertDataBG, setAlertDataBG] = useState('');
    const [showAlertData, setshowAlertData] = useState("");
    const [update_Status_Closed] = useMutation(updateStatusClosed);
    const [Get_All_Tickets_By_Single_User] = useMutation(GetAllTicketsBySingleUser);

    function moveToViewTicketPage(ticketID) {
        localStorage.setItem('singleTicketId', ticketID);
        router.push('singleTicketView');
    }

    async function getAllTicketsBySingleUser() {
        let LoginUserId = (localStorage.getItem('supportTicketLoginUserId'))
        await Get_All_Tickets_By_Single_User({
            variables: {
                userId: Number(LoginUserId)
            }
        })
            .then(res => {
                setAllTickets(res.data.getAllTicketsBySingleUser)
            })
            .catch(err => {
                setShowAlert(true)
                setAlertBg('danger')
                setAlertData(err?.message)
            });
    };

    useEffect(() => {
        getAllTicketsBySingleUser()
    }, []);

    async function makeTicketClosed(ticketId) {
        await update_Status_Closed({
            variables: {
                ticketId: ticketId
            }
        })
            .then(async (res) => {
                setAlertData(true)
                setAlertDataBG('success')
                setshowAlertData('Ticket Closed Successfully!')
                getAllTicketsBySingleUser()
            })
            .catch(error => {
                setAlertData(true)
                setAlertDataBG('danger')
                setshowAlertData(error?.message)
            });
    }

    useEffect(() => {
        setTimeout(function () {
            if (alertData === true) {
                setAlertData(false)
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
            {showAlert ?
                <div className={`alert alert-${alertBg} mb-0`} role="alert">
                    {alertData}
                </div>
                :
                <></>
            }
            <HeaderNav pageName='ticketView' />
            <div className={styles.ContainerWidth}>
                <div className="m-3">
                    <div className="text-center mt-3">
                        <h1>My Tickets</h1>
                    </div>

                    <Table striped bordered hover variant="light" className='mt-3 text-center'>
                        <thead>
                            <tr>
                                <th className='p-3 fs-5'>Id</th>
                                <th className='p-3 fs-5'>Title</th>
                                <th className={`p-3 fs-5 ${styles.hideColumnAfterLGScrn}`}>Catg.</th>
                                <th className='p-3 fs-5'>Status</th>
                                <th className={`p-3 fs-5 ${styles.hideColumnAfterLGScrn}`}>Priority</th>
                                <th className={`p-3 fs-5 ${styles.hideColumnAfterMDScrn}`}>Duration</th>
                                <th className='p-3 fs-5'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTickets.map((allTickets, index) => (
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>{index + 1}</td>
                                    <td>{allTickets.title}</td>
                                    <td className={`${styles.hideColumnAfterLGScrn}`}>{allTickets.category.category_name}</td>
                                    <td>{allTickets.status === 'open' ? <b>{allTickets.status}</b> : `${allTickets.status}`}</td>
                                    <td className={`${styles.hideColumnAfterLGScrn} ${allTickets.priority === 'High' ? 'text-danger' : 'text-black'}`}><b>{allTickets.priority}</b></td>
                                    <td className={`${styles.hideColumnAfterMDScrn}`}>
                                    {(moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).years() !== 0 ?
                                                (moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).years() + ' Years'
                                                :
                                                <>
                                                    {(moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).months() !== 0 ?
                                                        (moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).months() + ' Months'
                                                        :
                                                        <>
                                                            {(moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).days() !== 0 ?
                                                                (moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).days() + ' Days'
                                                                :
                                                                <>
                                                                    {(moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).hours() !== 0 ?
                                                                        (moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).hours() + ' Hours'
                                                                        :
                                                                        <>
                                                                            {(moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).minutes() !== 0 ?
                                                                                (moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).minutes() + ' Minutes'
                                                                                :
                                                                                <>
                                                                                    {(moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).seconds() !== 0 ?
                                                                                        (moment.duration(moment().diff(moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')))).seconds() + ' Seconds'
                                                                                        :
                                                                                        <></>
                                                                                    }
                                                                                </>
                                                                            }
                                                                        </>
                                                                    }
                                                                </>
                                                            }
                                                        </>
                                                    }
                                                </>
                                            }
                                    </td>
                                    <td className={styles.hideColumnAfterLGScrn}>
                                        <button type="button" className="btn btn-primary" onClick={(e) => moveToViewTicketPage(allTickets.id)}>View</button>
                                        {allTickets.status !== 'closed' ?
                                            <>
                                                &nbsp;
                                                <button type="button" className="btn btn-warning mt-sm-0 mt-2" onClick={() => makeTicketClosed(allTickets.id)}>Closed</button>
                                            </>
                                            :
                                            <></>
                                        }
                                    </td>
                                    <td className={styles.showColumnAfterLGScrn}>
                                        <button type="button" className="btn btn-primary" onClick={(e) => moveToViewTicketPage(allTickets.id)}>V</button>
                                        {allTickets.status !== 'closed' ?
                                            <>
                                                &nbsp;
                                                <button type="button" className="btn btn-warning mt-sm-0 mt-2" onClick={() => makeTicketClosed(allTickets.id)}>C</button>
                                            </>
                                            :
                                            <></>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div >
    )
}
