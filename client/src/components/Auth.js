import { useUI } from "../context";
import Login from "./Login";
import Register from "./Register";

export default function Auth() {
	const { showRegister } = useUI();

	return showRegister ? <Register /> : <Login />;
}
