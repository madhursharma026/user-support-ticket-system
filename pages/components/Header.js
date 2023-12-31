import Link from 'next/link';
import { Nav } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Navbar from 'react-bootstrap/Navbar';
import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { isAuthenticated } from '../AuthCheck/auth';
import styles from '.././../styles/Header/Header.module.css';

function HeaderNav(props) {
    const router = useRouter();
    const [userLogin, setUserLogin] = useState(false)

    function logoutUser() {
        localStorage.setItem('supportTicketLoginUserId', '')
        localStorage.setItem('supportTicketLoginUserEmailAddress', '')
        localStorage.setItem('supportTicketLoginUserUserPosition', '')
        router.push('/login');
    }
    useEffect(() => {
        if (isAuthenticated()) {
            setUserLogin(true)
        }
    })

    return (
        <div className={`${styles.HeaderStyle} py-4 px-xl-0 px-3`}>
            <div className={`${styles.ContainerWidth}`}>
                <Navbar expand="lg">
                    {/* <div className={`${styles.ContainerWidth} py-2 my-1`}> */}
                    <Link href="/" className='px-1'>
                        <img src="https://www.freshworks.com/static-assets/images/common/company/logos/logo-fworks-white.svg" alt="#ImgNotFound" width='160px' height="32px" />
                    </Link>
                    {(userLogin) ?
                        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ background: 'white' }} />
                        :
                        <></>
                    }
                    <Navbar.Collapse className="justify-content-end">
                        <Nav className={styles.navOptionsBeforeLGScrn}>
                            {(userLogin) ?
                                <>
                                    <Link href='/' className={`${props.pageName === 'homePage' ? styles.activeLink : styles.unActiveLink} text-white mx-2`}>Create Tickets</Link>
                                    <Link href='ticketView' className={`${props.pageName === 'ticketView' ? styles.activeLink : styles.unActiveLink} text-white mx-2`}>View Tickets</Link>
                                    <Link href='closedTicketView' className={`${props.pageName === 'closedTicketView' ? styles.activeLink : styles.unActiveLink} text-white mx-2`}>Closed Tickets</Link>
                                    <Dropdown style={{ marginTop: '-6px' }}>
                                        <Dropdown.Toggle className={`${props.pageName === 'razorpayPayment' ? styles.activeLink : styles.unActiveLink} ${props.pageName === 'bitpayPayment' ? styles.activeLink : styles.unActiveLink} text-white`} id="dropdown-basic" style={{ background: 'transparent', border: 0 }}>
                                            Payment
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Link className={`p-2 text-black ${props.pageName === 'razorpayPayment' ? styles.activeLink : styles.unActiveLink}`} href="/razorpayPayment" style={{ display: 'block' }}>Razorpay</Link>
                                            <Link className={`p-2 text-black ${props.pageName === 'bitpayPayment' ? styles.activeLink : styles.unActiveLink}`} href="/bitpayPayment" style={{ display: 'block' }}>Bitpay</Link>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <span onClick={() => logoutUser()} style={{ cursor: 'pointer' }} className={`${props.pageName === 'Logout' ? styles.activeLink : styles.unActiveLink} text-white mx-2`}>Logout</span>
                                </>
                                :
                                <></>
                            }
                        </Nav>
                        <Nav className={styles.navOptionsAfterLGScrn}>
                            {(userLogin) ?
                                <div className='mt-3'>
                                    <Link href='/' className={`${props.pageName === 'homePage' ? styles.activeLink : styles.unActiveLink} text-white mx-2 py-2`} style={{ display: 'block' }}>Create Tickets</Link>
                                    <Link href='ticketView' className={`${props.pageName === 'ticketView' ? styles.activeLink : styles.unActiveLink} text-white mx-2 py-2`} style={{ display: 'block' }}>View Tickets</Link>
                                    <Link href='closedTicketView' className={`${props.pageName === 'closedTicketView' ? styles.activeLink : styles.unActiveLink} text-white mx-2 py-2`} style={{ display: 'block' }}>Closed Tickets</Link>
                                    <Dropdown style={{ marginTop: '-7px' }}>
                                        <Dropdown.Toggle className={`${props.pageName === 'razorpayPayment' ? styles.activeLink : styles.unActiveLink} ${props.pageName === 'bitpayPayment' ? styles.activeLink : styles.unActiveLink} text-white py-2`} id="dropdown-basic" style={{ background: 'transparent', border: 0, marginLeft: '-5px' }}>
                                            Payment
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Link className={`p-2 text-black ${props.pageName === 'razorpayPayment' ? styles.activeLink : styles.unActiveLink}`} href="/razorpayPayment" style={{ display: 'block' }}>Razorpay</Link>
                                            <Link className={`p-2 text-black ${props.pageName === 'bitpayPayment' ? styles.activeLink : styles.unActiveLink}`} href="/bitpayPayment" style={{ display: 'block' }}>Bitpay</Link>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <span onClick={() => logoutUser()} style={{ cursor: 'pointer', display: 'block' }} className={`${props.pageName === 'Logout' ? styles.activeLink : styles.unActiveLink} text-white mx-2 py-2`}>Logout</span>
                                </div>
                                :
                                <></>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </div>
    );
}

export default HeaderNav;

