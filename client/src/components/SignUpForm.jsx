import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { validateEmail, validatePassword, validateUsername } from "../util/validators";
import { BACKEND_BASE_URL } from "../config";

export default function SignUpForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [privacyAgreement, setPrivacyAgreement] = useState(true);

    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    const [loading, setLoading] = useState(false);
    const [userCreatedSuccessfully, setUserCreatedSuccessfully] = useState(false);
    const [timer, setTimer] = useState(4);
    const intervalIdRef = useRef(0);
    const [errorOccurred, setErrorOccurred] = useState(false);


    useEffect(() => {
        setIsPasswordValid((password.length > 0) ? validatePassword(password) : true)
        setIsConfirmPasswordValid((confirmPassword.length > 0) ? (confirmPassword.localeCompare(password) === 0) : true);
    }, [confirmPassword, password])

    useEffect(() => {
        setIsEmailValid((email.length > 0) ? validateEmail(email) : true)
    }, [email])

    useEffect(() => {
        setIsUsernameValid((username.length > 0) ? validateUsername(username) : true)
    }, [username])

    useEffect(() => {
        if (timer === 0 && userCreatedSuccessfully) {
            clearInterval(intervalIdRef.current);
            navigate("/gettingStarted");
        } else if (timer === 0 && errorOccurred) {
            clearInterval(intervalIdRef.current);
        }
    }, [timer, navigate, userCreatedSuccessfully, errorOccurred, intervalIdRef]);

    useEffect(()=> {
        const timeout = setTimeout(() => {
            setErrorOccurred(false);
        }, 1500);
        return () => clearTimeout(timeout);
    }, [errorOccurred])

    useEffect(() => {
        if (userCreatedSuccessfully || errorOccurred) {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
        return ()=> clearTimeout(intervalIdRef.current);
    }, [userCreatedSuccessfully, errorOccurred])

    function usernameOnChangeHandler(e) {
        setUsername(e.target.value);
    }
    function emailOnChangeHandler(e) {
        setEmail(e.target.value);
    }
    function passwordOnChangeHandler(e) {
        setPassword(e.target.value);
    }
    function confirmPasswordOnChangeHandler(e) {
        setConfirmPassword(e.target.value);
    }
    function privacyOnChangeHandler(e) {
        setPrivacyAgreement(e.target.checked);
    }
    function parseInvalidFieldResponse(response) {
        if (response.error) {
            response.error.forEach((e) => {
                if (e.path.localeCompare("username")) {
                    setIsUsernameValid(false);
                } else if (e.path.localeCompare("password")) {
                    setIsPasswordValid(false);
                    setIsConfirmPasswordValid(false);
                } else if (e.path.localeCompare("email")) {
                    setIsEmailValid(false);
                }
            });
        }
    }
    function startRedirectToLoginPageTimer() {
        const interval = setInterval(() => {
            setTimer((prevTimerCount) => {
                return prevTimerCount - 1;
            });
        }, 900);
        intervalIdRef.current = interval;
    }
    function startErrorToastDisappearTimer() {
        const interval = setInterval(() => {
            setTimer((prevTimerCount) => {
                return prevTimerCount - 1;
            });
        }, 900);
        intervalIdRef.current = interval;
    }
    async function createAccount(e) {
        setLoading((prevLoading) => {
            return !prevLoading;
        })
        try {
            e.preventDefault();
            const usernameValidityResponse = await fetch(`${BACKEND_BASE_URL}/check-username?username=${username}`, { mode: 'cors' });
            const emailValidityResponse = await fetch(`${BACKEND_BASE_URL}/check-email?email=${email}`, { mode: 'cors' });
            const usernameValidityResponseJson = await usernameValidityResponse.json();
            const emailValidityResponseJson = await emailValidityResponse.json();
            setIsUsernameAvailable((usernameValidityResponse.status === 200 && usernameValidityResponseJson.msg.localeCompare("available") === 0) ? true : false);
            setIsEmailAvailable((emailValidityResponse.status === 200 && emailValidityResponseJson.msg.localeCompare("available") === 0) ? true : false);
            if (!(usernameValidityResponse.status === 200 && emailValidityResponse.status === 200)) {
                setLoading((prevLoading) => {
                    return !prevLoading;
                })
                return;
            }
            const postBodyJson = {
                username: username,
                email: email,
                password: password
            }
            const createAccountResponse = await fetch(`${BACKEND_BASE_URL}/signup`, {
                mode: 'cors',
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postBodyJson)
            });
            const createAccountResponseJson = await createAccountResponse.json();
            const createAccountResponseStatus = createAccountResponse.status;
            switch (createAccountResponseStatus) {
                case 201:
                    setUserCreatedSuccessfully(true);
                    startRedirectToLoginPageTimer();
                    break;
                case 403:
                    parseInvalidFieldResponse(createAccountResponseJson);
                    break;
                case 406:
                    if (createAccountResponseJson.email) {
                        setIsEmailAvailable(false);
                    } else if (createAccountResponseJson.username) {
                        setIsUsernameAvailable(false);
                    }
                    break;
                case 500:
                    setErrorOccurred(true);
                    startErrorToastDisappearTimer();
                    break;
                default:
            }
            console.log(createAccountResponseJson);
            setLoading((prevLoading) => {
                return !prevLoading;
            })
        } catch (error) {
            console.log(error);
            setLoading((prevLoading) => {
                return !prevLoading;
            })
        }
    }
    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900  pt-28">
                {userCreatedSuccessfully ?
                    <div className="flex flex-col items-center justify-center pb-12">
                        <div className="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
                            <svg className="w-5 h-5" fill="#DC7633" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="56" zoomAndPan="magnify" viewBox="0 0 375 374.9999" height="56" preserveAspectRatio="xMidYMid meet" version="1.0">
                                <path id="pathAttribute" d="M 319.652344 296.835938 C 301.910156 303.40625 279.570312 321.878906 269.804688 338.0625 C 260.03125 354.246094 237.632812 362.226562 219.816406 355.867188 C 201.996094 349.507812 172.996094 349.324219 155.09375 355.449219 C 137.191406 361.574219 114.898438 353.308594 105.339844 337 C 95.78125 320.691406 73.6875 301.929688 56.027344 295.132812 C 38.375 288.335938 26.617188 267.691406 29.789062 249.0625 C 32.964844 230.433594 28.113281 201.878906 18.964844 185.339844 C 9.8125 168.796875 14.09375 145.4375 28.519531 133.203125 C 42.941406 120.972656 57.605469 95.984375 61.242188 77.4375 C 64.878906 58.894531 83.195312 43.746094 102.117188 43.632812 C 121.039062 43.519531 148.355469 33.792969 163.078125 21.921875 C 177.800781 10.046875 201.582031 10.203125 216.152344 22.261719 C 230.71875 34.324219 257.90625 44.40625 276.824219 44.761719 C 295.746094 45.117188 313.863281 60.503906 317.257812 79.09375 C 320.65625 97.679688 334.996094 122.855469 349.257812 135.273438 C 363.519531 147.695312 367.5 171.109375 358.136719 187.53125 C 348.773438 203.949219 343.550781 232.4375 346.484375 251.109375 C 349.417969 269.777344 337.394531 290.269531 319.652344 296.835938 Z M 319.652344 296.835938 " fillOpacity="1" fillRule="nonzero" fill="#00ff00" strokeWidth="1" stroke="#727272" />
                                <g id="inner-icon" transform="translate(85, 75)">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="219" zoomAndPan="magnify" viewBox="0 0 30 30.000001" height="219" preserveAspectRatio="xMidYMid meet" version="1.0" id="IconChangeColor">
                                        <defs>
                                            <clipPath id="id1">
                                                <path d="M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 " clipRule="nonzero" id="mainIconPathAttribute" fill="#ffffff" strokeWidth="0" stroke="#00ff00" />
                                            </clipPath>
                                        </defs>
                                        <g clipPath="url(#id1)">
                                            <path fill="#ffffff" d="M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 " fillOpacity="1" fillRule="nonzero" id="mainIconPathAttribute" stroke="#00ff00" />
                                        </g>
                                    </svg>
                                </g>
                            </svg>
                            <div className="pl-4 text-sm font-normal">Account created successfully ({timer}s)</div>
                        </div>
                    </div>
                    : errorOccurred ?
                    <div className="flex flex-col items-center justify-center pb-12">
                        <div className="flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
                            <svg className="w-5 h-5" fill="#DC7633" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="56" zoomAndPan="magnify" viewBox="0 0 375 374.9999" height="56" preserveAspectRatio="xMidYMid meet" version="1.0">
                                <path id="pathAttribute" d="M 319.652344 296.835938 C 301.910156 303.40625 279.570312 321.878906 269.804688 338.0625 C 260.03125 354.246094 237.632812 362.226562 219.816406 355.867188 C 201.996094 349.507812 172.996094 349.324219 155.09375 355.449219 C 137.191406 361.574219 114.898438 353.308594 105.339844 337 C 95.78125 320.691406 73.6875 301.929688 56.027344 295.132812 C 38.375 288.335938 26.617188 267.691406 29.789062 249.0625 C 32.964844 230.433594 28.113281 201.878906 18.964844 185.339844 C 9.8125 168.796875 14.09375 145.4375 28.519531 133.203125 C 42.941406 120.972656 57.605469 95.984375 61.242188 77.4375 C 64.878906 58.894531 83.195312 43.746094 102.117188 43.632812 C 121.039062 43.519531 148.355469 33.792969 163.078125 21.921875 C 177.800781 10.046875 201.582031 10.203125 216.152344 22.261719 C 230.71875 34.324219 257.90625 44.40625 276.824219 44.761719 C 295.746094 45.117188 313.863281 60.503906 317.257812 79.09375 C 320.65625 97.679688 334.996094 122.855469 349.257812 135.273438 C 363.519531 147.695312 367.5 171.109375 358.136719 187.53125 C 348.773438 203.949219 343.550781 232.4375 346.484375 251.109375 C 349.417969 269.777344 337.394531 290.269531 319.652344 296.835938 Z M 319.652344 296.835938 " fillOpacity="1" fillRule="nonzero" />
                                <g id="inner-icon" transform="translate(85, 75)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16" id="IconChangeColor">
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" id="mainIconPathAttribute" fill="#ffffff" strokeWidth="0" stroke="#ff0000" />
                                    </svg>
                                </g>
                            </svg>
                            <div className="pl-4 text-sm font-normal">Error Occured! Try Again {timer}s</div>
                        </div>
                    </div>
                        : null
                }
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link to="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
                        Code-Crunch
                    </Link>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create your Free Account &#128512;
                            </h1>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="ml-0 text-sm">
                                        <button type="button" className="text-center inline-flex items-center py-2.5 px-4 mr-1 mb-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                            <svg className="w-5 h-5 mr-2 -ml-1" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_13183_10121)">
                                                    <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8" />
                                                    <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853" />
                                                    <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04" />
                                                    <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_13183_10121">
                                                        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            Sign up with Google
                                        </button>
                                    </div>
                                    <div className="ml-0 text-sm">
                                        <button type="button" className="py-2.5 px-4 mr-1 mb-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 text-center inline-flex items-center">
                                            <svg className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                                                <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z">
                                                </path>
                                            </svg>
                                            Sign up with GitHub
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="inline-flex items-center justify-center w-full">
                                <hr className="w-96 h-px bg-gray-300 border-0 dark:bg-gray-700" />
                                <div className="absolute px-2 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900 text-gray-500">
                                    or
                                </div>
                            </div>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose a username</label>
                                    <input onChange={usernameOnChangeHandler} type="text" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="codding-warrior" required />
                                    {!isUsernameValid ? <label className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">Please enter valid username</label> : <></>}
                                    {!isUsernameAvailable ? <label className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">Username is already taken</label> : <></>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input onChange={emailOnChangeHandler} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                                    {!isEmailValid ? <label className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">Please enter valid Email</label> : <></>}
                                    {!isEmailAvailable ? <label className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">Email is already associated with an account</label> : <></>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input onChange={passwordOnChangeHandler} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                    {!isPasswordValid ? <label className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">Please strong password</label> : <></>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Re-enter Password</label>
                                    <input onChange={confirmPasswordOnChangeHandler} type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                    {!isConfirmPasswordValid ? <label className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">Password did not match</label> : <></>}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input onChange={privacyOnChangeHandler} id="privacy" aria-describedby="privacy" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="privacy" className="text-gray-500 dark:text-gray-300">By signing up, you are creating a Flowbite account, and you agree to Flowbite’s Terms of Use and Privacy Policy.</label>
                                        </div>
                                    </div>
                                </div>
                                {!privacyAgreement ? <label className="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">It is mandatory to accept privacy terms and conditions</label> : <></>}
                                {
                                    (isEmailValid && isPasswordValid && isConfirmPasswordValid) && (email.length > 0 && password.length > 0 && confirmPassword.length > 0) ?
                                        loading ?
                                            <button disabled type="button" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg>
                                                Loading...
                                            </button>
                                            :
                                            <button onClick={createAccount} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                                        : <button onClick={(e) => { usernameOnChangeHandler(e); emailOnChangeHandler(e); passwordOnChangeHandler(e); confirmPasswordOnChangeHandler(e); setPrivacyAgreement(document.getElementById("privacy").checked); }} type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                                }
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Link to="/gettingStarted" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}