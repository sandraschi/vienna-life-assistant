import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * DEV-ONLY auth gate for the Personal section.
 * Default credentials admin/admin are for local development. Override with
 * VITE_AUTH_USER / VITE_AUTH_PASS at build time. This is NOT real security —
 * it keeps casual eyes (and demos) out of medical/financial pages on a local
 * app. Session lives in sessionStorage (cleared when the tab closes).
 */
const DEV_USER = import.meta.env.VITE_AUTH_USER || "admin";
const DEV_PASS = import.meta.env.VITE_AUTH_PASS || "admin";

interface AuthCtx {
	authed: boolean;
	login: (user: string, pass: string) => boolean;
	logout: () => void;
}

const Ctx = createContext<AuthCtx>({
	authed: false,
	login: () => false,
	logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const [authed, setAuthed] = useState<boolean>(() => {
		try {
			return sessionStorage.getItem("vilife-auth") === "1";
		} catch {
			return false;
		}
	});

	const login = useCallback((user: string, pass: string) => {
		const ok = user === DEV_USER && pass === DEV_PASS;
		if (ok) {
			try {
				sessionStorage.setItem("vilife-auth", "1");
			} catch {
				/* ignore */
			}
			setAuthed(true);
		}
		return ok;
	}, []);

	const logout = useCallback(() => {
		try {
			sessionStorage.removeItem("vilife-auth");
		} catch {
			/* ignore */
		}
		setAuthed(false);
	}, []);

	return (
		<Ctx.Provider value={{ authed, login, logout }}>{children}</Ctx.Provider>
	);
}

export function useAuth() {
	return useContext(Ctx);
}

export function RequireAuth({ children }: { children: ReactNode }) {
	const { authed } = useAuth();
	const location = useLocation();
	if (!authed) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}
	return <>{children}</>;
}
