import { useState, useEffect, FormEvent } from "react";
import Form from "../Form";
import { signupUser } from "../../services/authServices";
import { useHistory, useLocation } from "react-router-dom";
import { FormValidator } from "../../utilities/formValidator";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const loc = useLocation();

  useEffect(() => {
    if (loc.search.includes("email")) {
      setEmail(loc.search.slice(loc.search.indexOf("=") + 1));
    }
  }, [loc]);

  const SIGNUP = async (e: FormEvent) => {
    e.preventDefault();

    const { message, success } = FormValidator({
      email,
      username,
      password,
      repeatPassword,
    });

    if (success) {
      setLoading(true);

      const response = await signupUser(email, username.trim().toLowerCase(), password);
      if (response.error) {
        setError(response.message);
        setLoading(false);
      } else {
        history.push("/login");
      }
    } else {
      setError(message);
    }
  };

  return (
    <Form
      username={username}
      onUsernameChange={setUsername}
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      repeatPassword={repeatPassword}
      onRepeatPasswordChange={setRepeatPassword}
      formType="Register"
      errorMessage={error}
      onFormSubmit={SIGNUP}
      loading={loading}
    />
  );
};

export default Register;
