import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { apiUrl } from "../../hooks/constant";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { notifyToast } from "../../components/toast/notifyToast";

const NewRoom = () => {
	const [info, setInfo] = useState({
		title: "",
		desc: "",
		price: "",
		maxPeople: "",
	});
	const [hotelId, setHotelId] = useState(undefined);
	const [rooms, setRooms] = useState([]);

	const { data, loading, error } = useFetch("/hotels");

	const handleChange = (e) => {
		setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
	};

	const handleClick = async (e) => {
		e.preventDefault();
		if (rooms.length === 0) return;
		const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
		try {
			const res = await axios.post(`${apiUrl}/rooms/${hotelId}`, { ...info, roomNumbers });
			notifyToast(res.data.message, "success");
			setInfo({
				title: "",
				desc: "",
				price: "",
				maxPeople: "",
			});
		} catch (err) {
			console.log(err);
		}
	};

	console.log(info);
	return (
		<div className="new">
			<ToastContainer />
			res
			<Sidebar />
			<div className="newContainer">
				<Navbar />
				<div className="top">
					<h1>Add New Room</h1>
				</div>
				<div className="bottom">
					<div className="right">
						<form>
							{roomInputs.map((input) => (
								<div className="formInput" key={input.id}>
									<label>{input.label}</label>
									<input id={input.id} type={input.type} placeholder={input.placeholder} onChange={handleChange} value={info[input.id]} />
								</div>
							))}
							<div className="formInput">
								<label>Rooms</label>
								<textarea onChange={(e) => setRooms(e.target.value)} placeholder="give comma between room numbers." />
							</div>
							<div className="formInput">
								<label>Choose a hotel</label>
								<select id="hotelId" onChange={(e) => setHotelId(e.target.value)}>
									{loading
										? "loading"
										: data &&
										  data.map((hotel) => (
												<option key={hotel._id} value={hotel._id}>
													{hotel.name}
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

export default NewRoom;
