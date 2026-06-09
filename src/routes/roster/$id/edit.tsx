import { createFileRoute } from '@tanstack/react-router';
import { PlayerEdit } from '@/pages/PlayerEdit';

export const Route = createFileRoute('/roster/$id/edit')({
	component: () => {
		const { id } = Route.useParams();
		return <PlayerEdit id={id} />;
	},
});
