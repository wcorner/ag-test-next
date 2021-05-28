import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import kwesforms from 'kwesforms';
import Newsletter from "../common/Newsletter";

const ContactForm = ({dynamicPageItem}) => {

    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [asyncStatus, setAsyncStatus] = useState('idle');

    useEffect(() => {
        if (asyncStatus === 'resolved') {
            setTimeout(() => {
                setAsyncStatus('idle');
            }, 2000);
        }
    },[asyncStatus]);

    useEffect(() => {
        kwesforms.init();
    });

    function handleChange(el) {
        setFormValues({ ...formValues, [el.target.name]: el.target.value});
    }

    async function handleSubmit(el) {
        el.preventDefault();
        setAsyncStatus('pending');
        const res = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(formValues),
        });

        if (res.status === 200) {
            setFormValues({name: '', email: '', message: ''});
            toast.success('Message Submitted');
            return setAsyncStatus(('resolved'));
        }
        toast.error(`Error Sending Message: ${res.status}`);
        return setAsyncStatus('rejected');
    }

    return (
        <div className="relative px-8">
            <ToastContainer />

            <h1>Newsletter</h1>
            <Newsletter />

            <h1>Kwes Form</h1>
            <form className="kwes-form" action="https://kwes.io/api/foreign/forms/bX0v4wYsK6yc84zoFIp1">
                <label htmlFor="name">Your Name</label>
                <input type="text" name="name" rules="required|max:255" />
                <button type="submit">Submit</button>
            </form>


            <h1>Nodemailer</h1>
            <header className="sub-form__header">
            <span className="form-title">
                {asyncStatus === 'idle' && 'Send a message'}
                {asyncStatus === 'pending' && 'Send a message'}
                {asyncStatus === 'resolved' && 'Credentials sent'}
                {asyncStatus === 'rejected' && 'Error sending credentials'}
            </span>
            </header>
            <form className="sub-form__form" onSubmit={handleSubmit}>
                <div className="form-field__wrap">
                    <input
                        value={formValues.name}
                        onChange={handleChange}
                        type="name"
                        name="name"
                        id="name"
                        className="form-field"
                        placeholder="Name"
                    />
                </div>
                <div className="form-field__wrap">
                    <input
                        value={formValues.email}
                        onChange={handleChange}
                        type="email"
                        name="email"
                        id="email"
                        className="form-field"
                        placeholder="Email"
                        spellCheck="false"
                    />
                </div>
                <div className="form-field__wrap">
                    <textarea
                        value={formValues.message}
                        onChange={handleChange}
                        name="message"
                        id="message"
                        className="form-field"
                        placeholder="Message"
                        spellCheck="false"
                    />
                </div>
                <button
                    type="submit"
                    className="submit-form__cta form-field"
                    disabled={formValues.name.length === 0 || formValues.email.length === 0}
                >
                    {asyncStatus === 'idle' && 'Submit credentials'}
                    {asyncStatus === 'pending' && 'Submitting crendentials...'}
                    {asyncStatus === 'resolved' && 'Submit credentials'}
                    {asyncStatus === 'rejected' && 'Submit credentials'}
                </button>
            </form>
        </div>
    );

};

export default ContactForm;
