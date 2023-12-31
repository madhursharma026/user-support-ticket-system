import dynamic from 'next/dynamic';
import styles from '../../../styles/Support/support.module.css';

export default function SupportModule() {
    const DynamicComponentWithNoSSR = dynamic(
        () => import('./QuillEditor'),
        { ssr: false }
    );

    return (
        <>
            <div className={`p-0`}>
                <div className={`${styles.ContainerWidth}`}>
                    <div className={`row`}>
                        <div className={`col-lg-6`} style={{ background: "#253053" }}>
                            <h1 className={`${styles.sectionTitle} text-white py-md-5 py-3 px-5 ${styles.leftSide}`}><b>We’d love to hear from you</b></h1>
                        </div>
                        <div className={`col-lg-6 pt-5 mt-lg-5`}>
                            <div className={`${styles.maxWidthStyle} px-lg-0 px-3`}>
                                <h1 className={`${styles.sectionTitle}`}><b>Talk to us</b></h1>
                                <p className={`${styles.sectionBody} text-muted`}>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis id quibusdam voluptatibus alias suscipit. Inventore animi error, omnis totam quaerat a qui, eaque consequuntur vitae quod eveniet maiores deleniti perspiciatis sequi ex tenetur eos. Molestias veniam officia ut, ea cumque delectus necessitatibus, consequatur doloremque pariatur perferendis, labore quibusdam illo voluptas?
                                </p>
                            </div>
                            <div style={{ background: "#F5F7FA" }} className={`${styles.maxWidthStyle} py-3 px-3`}>
                                <h1 className={`${styles.subHeading2}`}><b>Couldn't get ahold of us?</b></h1>
                                <p className={`${styles.sectionBody} text-muted`}>Request a callback and we'll get back to you.</p>
                                <DynamicComponentWithNoSSR />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

