import { useSearchParams } from "react-router-dom";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
export default function GettingStarted() {
    const [searchParams] = useSearchParams();
    const signup = searchParams.get("signup")
    return (
        <> {
            signup==="true"? <SignUpForm />: <SignInForm/>
        }
        </>
    )
}