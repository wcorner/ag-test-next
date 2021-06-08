import useScript from "../../hooks/useScript";
import {useState} from "react";
import {toast} from "react-toastify";

const Newsletter = () => {

        const [formValues, setFormValues] = useState({
            firstname: '',
            lastname: '',
            email: '',
        });
        const [asyncStatus, setAsyncStatus] = useState('idle');


        async function handleSubmit(el) {
            el.preventDefault();
            setAsyncStatus('pending');

            let signUp = {
                recipientlist_id: '4155',
                email: "michael.j.fox@example.com",
            }

            console.log(signUp);

            let username = process.env.RAPID_USER;
            let password = process.env.RAPID_PASS;

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Basic ' + btoa(username + ":" + password));

            const res = await fetch('https://apiv3.emailsys.net/recipients', {
                    mode: 'no-cors',
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(signUp),
                }
            );

            if (res.status === 200) {
                setFormValues({firstname: '', lastname: '', email: ''});
                toast.success('Message Submitted');
                return setAsyncStatus(('resolved'));
            }
            toast.error(`Error Sending Message: ${res.status}`);
            return setAsyncStatus('rejected');
        }

        function handleChange(el) {
            setFormValues({...formValues, [el.target.name]: el.target.value});
        }

        return (
            <form method="post" onSubmit={handleSubmit}>
                <input type="text" name="firstname" id="firstname" placeholder="First name" onChange={handleChange}/>
                <input type="text" name="lastname" id="lastname" placeholder="Last name" onChange={handleChange}/>
                <input type="text" name="email" id="email" placeholder="Email" onChange={handleChange}/>
                <button type="submit">Subscribe</button>
            </form>
        );

    }
;

export default Newsletter;
