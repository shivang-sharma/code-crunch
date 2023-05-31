import Loader from "../../assets/icons/loader";
import "./Button.css";
const Button = ({ onSubmit, text, loading, disabled }) => {
  return (
    <button className="submit-btn" onClick={onSubmit} disabled={disabled}>
      {!loading ? text : <Loader className="spinner" />}
    </button>
  );
};

export default Button;
