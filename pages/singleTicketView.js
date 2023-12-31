import { useRouter } from 'next/router';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import HeaderNav from './components/Header';
import Button from 'react-bootstrap/Button';
import { useMutation } from '@apollo/client';
import ReactHtmlParser from 'react-html-parser';
import styles from '../styles/HomeStyle/Home.module.css';
import { CreateTicketReply, GetAllRepliesBySingleTicket, GetFindSingleTicket, updateStatusClosed } from './api/graphqlAPI';

export default function SingleTicketView() {
    const router = useRouter();
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [alertBg, setAlertBg] = useState();
    const [showAlert, setShowAlert] = useState();
    const [alertData, setAlertData] = useState();
    const [ticketDetail, setTicketDetail] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [ticketReplyMessage, setCategoryMessage] = useState('');
    const [Create_Ticket_Reply] = useMutation(CreateTicketReply);
    const [update_Status_Closed] = useMutation(updateStatusClosed);
    const [allTicketsReplies, setAllTicketsReplies] = useState([]);
    const [Get_Find_Single_Ticket] = useMutation(GetFindSingleTicket);
    const [Get_All_Replies_By_Single_Ticket] = useMutation(GetAllRepliesBySingleTicket);

    async function getSingleTicket() {
        let LoginUserId = (localStorage.getItem('supportTicketLoginUserId'))
        let singleTicketId = (localStorage.getItem('singleTicketId'))
        await Get_Find_Single_Ticket({
            variables: {
                userId: Number(LoginUserId),
                findSingleTicketId: Number(singleTicketId)
            }
        })
            .then(res => {
                setTicketDetail(res.data.findSingleTicket)
                setCategoryName(res.data.findSingleTicket.category.category_name)
            })
            .catch(err => {
                setShowAlert(true)
                setAlertBg('danger')
                setAlertData(err?.message)
            });
    };

    useEffect(() => {
        getSingleTicket()
    }, []);

    async function formSubmit() {
        let LoginUserId = (localStorage.getItem('supportTicketLoginUserId'))
        let singleTicketId = (localStorage.getItem('singleTicketId'))
        Create_Ticket_Reply({
            variables: {
                createTicketReplyArgs: {
                    message: ticketReplyMessage,
                    ticket_id: Number(singleTicketId),
                    replied_by_id: Number(LoginUserId)
                }
            },

        }).then(async (res) => {
            handleClose()
            setShowAlert(true)
            setAlertBg('success')
            setAlertData('Ticket Submit Successfully')
            setCategoryMessage('')
            getAllReplies()
        }).catch(error => {
            setShowAlert(true)
            setAlertBg('danger')
            setAlertData(error?.message)
        });
    }

    useEffect(() => {
        setTimeout(function () {
            if (showAlert === true) {
                setShowAlert(false)
            }
        }, 1000);
    },)

    async function getAllReplies() {
        let singleTicketId = (localStorage.getItem('singleTicketId'))
        await Get_All_Replies_By_Single_Ticket({
            variables: {
                ticketId: Number(singleTicketId)
            }
        })
            .then(res => {
                setAllTicketsReplies(res.data.getAllRepliesBySingleTicket)
            })
            .catch(err => {
                setShowAlert(true)
                setAlertBg('danger')
                setAlertData(err?.message)
            });
    };

    useEffect(() => {
        getAllReplies()
    }, []);



    async function makeTicketClosed(ticketId) {
        await update_Status_Closed({
            variables: {
                ticketId: ticketId
            }
        })
            .then(async (res) => {
                setShowAlert(true)
                setAlertBg('success')
                setAlertData('Ticket Closed Successfully!')
                getSingleTicket()
            })
            .catch(error => {
                setShowAlert(true)
                setAlertBg('danger')
                setAlertData(error?.message)
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
                    <div className='text-center mt-3'>
                        <h5>Ticket Id: {ticketDetail.ticket_id} ({ticketDetail.status})</h5>
                        <div className="row mb-4">
                            <div className="col-sm-6"><h5>Category: {categoryName}</h5></div>
                            <div className={`col-sm-6 ${ticketDetail.priority === 'High' ? 'text-danger' : 'text-black'}`} style={{ fontWeight: 'bold' }}><h5><u>{ticketDetail.priority}</u> Priority</h5></div>
                        </div>
                        <h2 style={{ textAlign: 'justify' }}>{ticketDetail.title}</h2>

                        <h6 className='mt-4' style={{ textAlign: 'justify' }}>
                            {ReactHtmlParser((ticketDetail.message))}
                        </h6>
                        <button type="button" className="btn btn-primary mt-4" onClick={() => router.back()}>Back</button>
                        &emsp;
                        <button type="button" className="btn btn-warning mt-4" onClick={() => makeTicketClosed(ticketDetail.id)}>Closed</button>
                        &emsp;
                        <button type="button" className="btn btn-primary mt-4" onClick={() => handleShow()}>Reply</button>
                    </div>
                </div>
                {(allTicketsReplies.length === 0) ?
                    <></>
                    :
                    <div className='mt-5 mx-3'>
                        <h1>Replies: </h1>
                        <Table striped bordered hover variant="light" className='mt-3 text-center'>
                            <thead>
                                <tr>
                                    <th className='p-3 fs-5'>Id</th>
                                    <th className='p-3 fs-5'>Title</th>
                                    <th className='p-3 fs-5'>Replied By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTicketsReplies.map((allTicketsReplies, index) => (
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>{index + 1}</td>
                                        <td>{allTicketsReplies.message}</td>
                                        <td><b>{allTicketsReplies.replied_by.firstName}</b> ({allTicketsReplies.replied_by.userPosition})</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                }
            </div>

            <Modal show={show} onHide={handleClose} backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reply Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label for="ticketReplyMessage" className="form-label">Messgae</label>
                    <textarea rows={7} className="form-control w-100" id="ticketReplyMessage" required value={ticketReplyMessage} onChange={(e) => setCategoryMessage(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => formSubmit()}>
                        Reply
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

