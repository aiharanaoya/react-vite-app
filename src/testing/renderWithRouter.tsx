import {
	createMemoryHistory,
	createRouter,
	RouterProvider,
} from '@tanstack/react-router';
import { render } from '@testing-library/react';
import { routeTree } from '@/routeTree.gen';

export const renderWithRouter = async (path = '/') => {
	const router = createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries: [path] }),
	});
	await router.load();
	return render(<RouterProvider router={router} />);
};
