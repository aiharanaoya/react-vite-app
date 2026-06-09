import {
	createContext,
	type FC,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

type ToastState = {
	message: string;
	variant: 'success' | 'error';
} | null;

type ToastContextValue = {
	toast: ToastState;
	notify: (message: string, variant?: 'success' | 'error') => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) throw new Error('useToast must be used within AppProvider');
	return context;
};

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [toast, setToast] = useState<ToastState>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const notify = useCallback(
		(message: string, variant: 'success' | 'error' = 'success') => {
			if (timerRef.current !== null) clearTimeout(timerRef.current);
			setToast({ message, variant });
			timerRef.current = setTimeout(() => setToast(null), 2600);
		},
		[],
	);

	useEffect(
		() => () => {
			if (timerRef.current !== null) clearTimeout(timerRef.current);
		},
		[],
	);

	return (
		<ToastContext.Provider value={{ toast, notify }}>
			{children}
		</ToastContext.Provider>
	);
};
