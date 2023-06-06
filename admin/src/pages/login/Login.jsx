import { useState, useContext } from "react";
import Navbar from "../../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import "./login.scss";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notifyToast } from "../../components/toast/notifyToast";

const Login = () => {
	const navigate = useNavigate();
	const { authState, loginUser } = useContext(AuthContext);
	const { loading, isAuthenticated, user } = authState;
	const [formUser, setFormUser] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formUser;

	console.log(isAuthenticated);
	useEffect(() => {
		if (isAuthenticated) navigate("/");
	}, [isAuthenticated]);

	const onChangeFormUser = (e) => {
		setFormUser((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};

	const login = async (e) => {
		e.preventDefault();
		try {
			const res = await loginUser(formUser);
			if (!res.isAdmin) {
				notifyToast("You are not admin", "error");
				return;
			}
			if (res.success) navigate("/");
			else notifyToast(res.message, "error");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Navbar />
			<ToastContainer />
			{loading ? (
				<div className="lds-ring">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			) : (
				<form className="login" onSubmit={(e) => login(e)}>
					<h2>Sign in account</h2>
					<div className="lContainer">
						<input type="email" placeholder="Email" name="email" value={email} onChange={(e) => onChangeFormUser(e)} className="lInput" required />
						<input type="password" placeholder="Password" name="password" value={password} onChange={(e) => onChangeFormUser(e)} className="lInput" required />
						<button className="lButton">Login</button>
					</div>
					<span className="optiopns">or use none of these options</span>
					<span className="policy">
						By signing in or creating an account, you agree with our{" "}
						<a href="#" style={{ textDecoration: "none" }}>
							Terms Conditions{" "}
						</a>{" "}
						and{" "}
						<a href="#" style={{ textDecoration: "none" }}>
							Privacy Statement
						</a>
					</span>
				</form>
			)}
		</>
	);
};

export default Login;
