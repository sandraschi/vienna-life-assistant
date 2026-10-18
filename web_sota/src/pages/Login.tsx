import { Lock } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation() as { state?: { from?: string } };
	const [user, setUser] = useState("");
	const [pass, setPass] = useState("");
	const [failed, setFailed] = useState(false);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (login(user.trim(), pass)) {
			navigate(location.state?.from || "/", { replace: true });
		} else {
			setFailed(true);
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-[#050505] page-enter"
			data-testid="login-page"
		>
			<form
				onSubmit={submit}
				className="glass-card p-8 w-full max-w-sm space-y-4"
			>
				<div className="flex items-center gap-3">
					<Lock className="w-5 h-5 text-amber-400" />
					<h1 className="text-xl font-black text-white uppercase tracking-tight">
						Personal
					</h1>
				</div>
				<p className="text-sm text-slate-300 leading-relaxed">
					Medical, diary, shopping, travel plans and finances live behind this
					gate. Dev login: admin / admin.
				</p>
				<input
					className="input-dark w-full"
					placeholder="User"
					value={user}
					onChange={(e) => setUser(e.target.value)}
					data-testid="login-user"
					autoComplete="username"
				/>
				<input
					className="input-dark w-full"
					placeholder="Password"
					type="password"
					value={pass}
					onChange={(e) => setPass(e.target.value)}
					data-testid="login-pass"
					autoComplete="current-password"
				/>
				{failed && (
					<p
						className="text-sm text-red-400 font-bold"
						data-testid="login-fail"
					>
						Wrong credentials.
					</p>
				)}
				<button
					type="submit"
					className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-black uppercase tracking-widest transition-colors"
					data-testid="login-go"
				>
					Unlock
				</button>
			</form>
		</div>
	);
}
