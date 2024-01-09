import moment from 'moment';
import { useRouter } from 'next/router';
import Table from 'react-bootstrap/Table';
import HeaderNav from './components/Header';
import { useEffect, useState } from 'react';
import styles from '../styles/HomeStyle/Home.module.css';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GetAllClosedTicketsBySingleUser, } from './api/graphqlAPI';

export default function ClosedTicketView() {
    const router = useRouter();
    const [allTickets, setAllTickets] = useState([]);
    const [alertData, setAlertData] = useState(false);
    const [alertDataBG, setAlertDataBG] = useState('');
    const [showAlertData, setshowAlertData] = useState("");
    const [Get_All_Tickets_By_Single_User] = useLazyQuery(GetAllClosedTicketsBySingleUser);

    function moveToViewTicketPage(ticketID) {
        localStorage.setItem('singleTicketId', ticketID);
        router.push('singleTicketView');
    }

    async function getAllClosedTicketsBySingleUser() {
        let LoginUserId = (localStorage.getItem('supportTicketLoginUserId'))
        await Get_All_Tickets_By_Single_User({
            variables: {
                userId: Number(LoginUserId)
            }
        })
            .then(res => {
                setAllTickets(res.data.getAllClosedTicketsBySingleUser)
            })
            .catch(err => {
                setAlertData(true)
                setAlertDataBG('danger')
                setshowAlertData(err?.message)
            });
    };

    useEffect(() => {
        getAllClosedTicketsBySingleUser()
    }, []);

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
            <HeaderNav pageName='closedTicketView' />
            <div className={styles.ContainerWidth}>
                <div className="m-3">
                    <div className="text-center mt-3">
                        <h1>Closed Tickets</h1>
                    </div>

                    <Table striped bordered hover variant="light" className='mt-3 text-center'>
                        <thead>
                            <tr>
                                <th className='p-3 fs-5'>Id</th>
                                <th className='p-3 fs-5'>Title</th>
                                <th className='p-3 fs-5'>Catg.</th>
                                <th className={`p-3 fs-5 ${styles.hideColumnAfterLGScrn}`}>Duration</th>
                                <th className={`p-3 fs-5 ${styles.hideColumnAfterMDScrn}`}>Priority</th>
                                <th className='p-3 fs-5'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTickets.map((allTickets, index) => (
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>{index + 1}</td>
                                    <td>{allTickets.title}</td>
                                    <td>{allTickets.category.category_name}</td>
                                    {/* <td className={`${styles.hideColumnAfterLGScrn}`}><b><td className={`${styles.hideColumnAfterLGScrn}`}><b>{moment(new Date(Number(allTickets.duration))).format('YYYY-MM-DD HH:mm:ss')}</b></td></b></td> */}
                                    <td className={styles.hideColumnAfterMDScrn}>
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
                                    <td className={`${styles.hideColumnAfterLGScrn} ${allTickets.priority === 'High' ? 'text-danger' : 'text-black'}`}><b>{allTickets.priority}</b></td>
                                    <td className={styles.hideColumnAfterLGScrn}>
                                        <button type="button" className="btn btn-primary" onClick={(e) => moveToViewTicketPage(allTickets.id)}>View</button>
                                    </td>
                                    <td className={styles.showColumnAfterLGScrn}>
                                        <button type="button" className="btn btn-primary" onClick={(e) => moveToViewTicketPage(allTickets.id)}>V</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
