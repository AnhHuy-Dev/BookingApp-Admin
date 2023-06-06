import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { apiUrl } from "../../hooks/constant";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notifyToast } from "../../components/toast/notifyToast";

const NewHotel = () => {
	const [files, setFiles] = useState("");
	const [info, setInfo] = useState({
		name: "",
		type: "",
		city: "",
		address: "",
		distance: "",
		title: "",
		desc: "",
		cheapestPrice: "",
	});
	const [rooms, setRooms] = useState([]);
	const [image, setImage] = useState();

	const { data, loading, error } = useFetch("/rooms");
	const handleChange = (e) => {
		setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};

	const handleSelect = (e) => {
		const value = Array.from(e.target.selectedOptions, (option) => option.value);
		setRooms(value);
	};

	const handleClick = async (e) => {
		e.preventDefault();
		try {
			const list = await Promise.all(
				Object.values(files).map(async (file) => {
					const data = new FormData();
					data.append("file", file);
					data.append("upload_preset", "upload");
					data.append("cloud_name", "dor1rlwhk");
					fetch("https://api.cloudinary.com/v1_1/dor1rlwhk/image/upload", {
						method: "post",
						body: data,
					})
						.then((res) => res.json())
						.then((data) => setImage(data));
					return image.secure_url;
				})
			);
			const newhotel = {
				...info,
				rooms,
				photos: list,
			};

			const res = await axios.post(`${apiUrl}/hotels`, newhotel);
			console.log(res);
			if (res.data.success) {
				notifyToast(res.data.message, "success");
				setInfo({
					name: "",
					type: "",
					city: "",
					address: "",
					distance: "",
					title: "",
					desc: "",
					cheapestPrice: "",
				});
				setFiles("");
			} else notifyToast("Error", "error");
		} catch (err) {
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
					<h1>Add New Product</h1>
				</div>
				<div className="bottom">
					<div className="left">
						<img src={files ? URL.createObjectURL(files[0]) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" />
					</div>
					<div className="right">
						<form>
							<div className="formInput">
								<label htmlFor="file">
									Image: <DriveFolderUploadOutlinedIcon className="icon" />
								</label>
								<input type="file" id="file" multiple onChange={(e) => setFiles(e.target.files)} style={{ display: "none" }} />
							</div>

							{hotelInputs.map((input) => (
								<div className="formInput" key={input.id}>
									<label>{input.label}</label>
									<input id={input.id} onChange={handleChange} type={input.type} placeholder={input.placeholder} value={info[input.id]} />
								</div>
							))}
							<div className="formInput">
								<label>Featured</label>
								<select id="featured" onChange={handleChange}>
									<option value={false}>No</option>
									<option value={true}>Yes</option>
								</select>
							</div>
							<div className="selectRooms">
								<label>Rooms</label>
								<select id="rooms" multiple onChange={handleSelect}>
									{loading
										? "loading"
										: data &&
										  data.map((room) => (
												<option key={room._id} value={room._id}>
													{room.title}
												</option>
										  ))}
								</select>
							</div>
							<button onClick={handleClick}>Send</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewHotel;
