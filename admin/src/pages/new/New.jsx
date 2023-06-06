import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notifyToast } from "../../components/toast/notifyToast";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";

const New = ({ inputs, title }) => {
	const [file, setFile] = useState("");
	const [info, setInfo] = useState({
		username: "",
		email: "",
		password: "",
		country: "",
		city: "",
		phone: "",
	});
	const [image, setImage] = useState();
	const { registerUser } = useContext(AuthContext);

	const handleChange = (e) => {
		setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};
	console.log(info);
	const handleClick = async (e) => {
		e.preventDefault();
		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", "upload");
		data.append("cloud_name", "dor1rlwhk");
		try {
			fetch("https://api.cloudinary.com/v1_1/dor1rlwhk/image/upload", {
				method: "post",
				body: data,
			})
				.then((res) => res.json())
				.then((data) => setImage(data));

			const newUser = {
				...info,
				img: image.secure_url,
			};

			const res = await registerUser(newUser);
			if (res.success) {
				notifyToast(res.message, "success");
				setInfo({
					username: "",
					email: "",
					password: "",
					country: "",
					city: "",
					phone: "",
				});
				setFile("");
			} else notifyToast(res.message, "error");
		} catch (err) {
			// notifyToast("Missing parameters required!", "error");
			console.log(err);
		}
	};

	return (
		<div className="new">
			<ToastContainer />
			<Sidebar />
			<div className="newContainer">
				<Navbar />
				<div className="top">
					<h1>{title}</h1>
				</div>
				<div className="bottom">
					<div className="left">
						<img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" />
					</div>
					<div className="right">
						<form>
							<div className="formInput">
								<label htmlFor="file">
									Image: <DriveFolderUploadOutlinedIcon className="icon" />
								</label>
								<input type="file" id="file" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
							</div>

							{inputs.map((input) => (
								<div className="formInput" key={input.id}>
									<label>{input.label}</label>
									<input onChange={handleChange} value={info[input.id]} type={input.type} placeholder={input.placeholder} id={input.id} required />
								</div>
							))}
							<button onClick={(e) => handleClick(e)}>Send</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default New;
