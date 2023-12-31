import Link from 'next/link';
import { useRouter } from "next/router";
import Footer from './components/Footer';
import HeaderNav from './components/Header';
import { useEffect, useState } from "react";
import { UserLogin } from "./api/graphqlAPI";
import { useMutation } from "@apollo/client";
import { isAuthenticated } from "./AuthCheck/auth";
import styles from '../styles/Login/login.module.css';

const Login = () => {
    const router = useRouter();
    const [User_Login] = useMutation(UserLogin);
    const [alertData, setAlertData] = useState(false);
    const [alertDataBG, setAlertDataBG] = useState('');
    const [showAlertData, setshowAlertData] = useState("");
    const [passwordValue, setPasswordValue] = useState('');
    const [emailAddressValue, setEmailAddressValue] = useState('');

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/');
        }
    }, []);

    async function submitForm(e) {
        e.preventDefault()
        await User_Login({
            variables: {
                loginUserArgs: {
                    emailAddress: emailAddressValue,
                    password: passwordValue
                }
            }
        })
            .then(async (res) => {
                setAlertData(true)
                setAlertDataBG('success')
                setEmailAddressValue('')
                setPasswordValue('')
                setshowAlertData('Login Successfully!')
                localStorage.setItem('supportTicketLoginUserId', res.data.loginUser.id);
                localStorage.setItem('supportTicketLoginUserEmailAddress', res.data.loginUser.emailAddress);
                localStorage.setItem('supportTicketLoginUserUserPosition', res.data.loginUser.userPosition);
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
                if (showAlertData === 'Login Successfully!') {
                    router.push('/')
                }
            }
        }, 1000);
    },)

    return (
        <div style={{ minHeight: '80vh' }}>
            {alertData ?
                <div className={`alert alert-${alertDataBG} mb-0`} role="alert">
                    {showAlertData}
                </div>
                :
                <></>
            }
            <HeaderNav />
            <div className={styles.loginBody}>
                <div className={`${styles.ContainerWidth} px-4 pt-3`}>
                    <h5><img src="https://website-assets-fd.freshworks.com/attachments/ckrykid1b07w5fxg0mcihkydx-fdesk.svg" alt="#ImgNotFound" className={styles.freshdeskLogo} /> Freshdesk</h5>
                    <div className="row pb-5">
                        <div className="col-lg-6 mt-5 pt-lg-5">
                            <h1 className={styles.heading}>Try Freshdesk for free</h1>
                            <h1 className={styles.subHeading}>No credit card required. No strings attached.</h1>
                            <ul>
                                <li><h1 className={styles.liStyle}>75% reduction in ticket resolution time</h1></li>
                                <li><h1 className={styles.liStyle}>3 month payback period</h1></li>
                                <li><h1 className={styles.liStyle}>54 hours per agent per year saved with automations</h1></li>
                            </ul>
                        </div>
                        <div className="col-lg-6 pt-lg-5 pt-3">
                            <div className={`card mt-lg-0 mt-3 p-3 ${styles.cardStyle}`}>
                                <div className="card-body">
                                    <h4 className="text-center mb-3"><b><u>Login Details</u></b></h4>
                                    <form onSubmit={(e) => submitForm(e)}>
                                        <div className="mb-3">
                                            <label for="exampleInputEmail1" className="form-label">Email address</label>
                                            <input type="email" className="form-control" id="exampleInputEmail1" required aria-describedby="emailHelp" value={emailAddressValue} onChange={(e) => setEmailAddressValue(e.target.value)} autoComplete='off' />
                                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                        </div>
                                        <div className="mb-3">
                                            <label for="exampleInputPassword1" className="form-label">Password</label>
                                            <input type="password" className="form-control" id="exampleInputPassword1" required value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} autoComplete='off' />
                                        </div>
                                        <div className="text-center mb-3">
                                            <Link href='/signup'>Create Account? Signup</Link>
                                        </div>
                                        <button type="submit" className="btn w-100" style={{ background: '#4825B3', color: 'white' }}>Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${styles.ContainerWidth} px-4 pt-5`}>
                <div className={styles.sampleLogo}>
                    <h5>Trusted by 60,000+ businesses</h5>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3ka006roxfn8s9sf1rw-aramex.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jr006qoxfnwd0h023t-orderin.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3je00i94dfnjxnwpox0-bridgestone.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3n400ia4dfnw9wxx748-decathlon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3mb003coffn6tocuww5-pearson.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                                <div className="col-4 mt-3">
                                    <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jh003boffnft190fy5-cinnamon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                                </div>
                            </div>
                        </div>
                        <div className="col-6"></div>
                    </div>
                </div>

                <div className={styles.sampleLogoAfterLGScrn}>
                    <div className="row text-center">
                        <h5><b>Trusted by 60,000+ businesses</b></h5>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3ka006roxfn8s9sf1rw-aramex.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jr006qoxfnwd0h023t-orderin.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3je00i94dfnjxnwpox0-bridgestone.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3n400ia4dfnw9wxx748-decathlon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3mb003coffn6tocuww5-pearson.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                        <div className="col-sm-4 col-6 mt-3">
                            <img src="https://website-assets-fd.freshworks.com/attachments/cl1knq3jh003boffnft190fy5-cinnamon.one-half.png" alt="#ImgNotFound" width="120px" height='45px' />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '70px' }}>
                <Footer />
            </div>
        </div>
    );
};

export default Login;

