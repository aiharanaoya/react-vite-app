import {
	createRootRoute,
	Outlet,
	useRouterState,
} from '@tanstack/react-router';
import { Toast } from '@/components/Toast';
import { TopNav } from '@/components/TopNav';
import { AppProvider } from '@/store/players';
import { useToast } from '@/store/toast';

const ToastDisplay = () => {
	const { toast } = useToast();
	return <Toast message={toast?.message} variant={toast?.variant} />;
};

const Inner = () => {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	return (
		<div className="flex flex-col min-h-full bg-[#f4f6f9]">
			<TopNav />
			<main key={pathname} id="main-content" className="flex-1 route-fade">
				<Outlet />
			</main>
			<ToastDisplay />
		</div>
	);
};

const RootLayout = () => (
	<AppProvider>
		<Inner />
	</AppProvider>
);

export const Route = createRootRoute({
	component: RootLayout,
});
