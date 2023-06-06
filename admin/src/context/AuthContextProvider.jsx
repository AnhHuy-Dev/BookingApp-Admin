import { createContext, useReducer, useEffect } from "react";
import { authReducer } from "../reducers/authReducer";
import useFetch from "../hooks/useFetch";
import { apiUrl, LOCAL_STORAGE_ACCESSTOKEN } from "../hooks/constant";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
	const [authState, dispatch] = useReducer(authReducer, {
		loading: true,
		isAuthenticated: false,
		user: null,
	});

	const loadUser = async () => {
		if (localStorage.getItem(LOCAL_STORAGE_ACCESSTOKEN)) setAuthToken(localStorage.getItem(LOCAL_STORAGE_ACCESSTOKEN));
		try {
			const res = await axios.get(`${apiUrl}/auth`);
			if (res.data.success) {
				dispatch({
					type: "SET_AUTH",
					payload: {
						isAuthenticated: true,
						user: res.data.user,
					},
				});
			}
		} catch (error) {
			localStorage.removeItem(LOCAL_STORAGE_ACCESSTOKEN);
			setAuthToken(null);
			dispatch({
				type: "SET_AUTH",
				payload: {
					isAuthenticated: false,
					user: null,
				},
			});
		}
	};

	useEffect(() => {
		loadUser();
	}, []);

	const loginUser = async (formUser) => {
		try {
			const res = await axios.post(`${apiUrl}/auth/login`, formUser);
			if (res.data.success && res.data.isAdmin) {
				localStorage.setItem(LOCAL_STORAGE_ACCESSTOKEN, res.data.accessToken);
				await loadUser();
			}
			return res.data;
		} catch (error) {
			if (error.response.data) return error.response.data; //error have response.data (server)
			else return { success: false, message: error.message };
		}
	};

	const logOutUser = async () => {
		localStorage.removeItem(LOCAL_STORAGE_ACCESSTOKEN);
		dispatch({
			type: "SET_AUTH",
			payload: {
				isAuthenticated: false,
				user: null,
			},
		});
	};

	const registerUser = async (formUser) => {
		try {
			const res = await axios.post(`${apiUrl}/auth/register`, formUser);
			if (res.data.success) return res.data;
		} catch (error) {
			if (error.response.data) return error.response.data; //error have response.data (server)
			else return { success: false, message: error.message };
		}
	};

	const contextData = { authState, loginUser, logOutUser, registerUser };

	return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
