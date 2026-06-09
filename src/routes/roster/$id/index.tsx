import { createFileRoute } from '@tanstack/react-router';
import { PlayerDetail } from '@/pages/PlayerDetail';

export const Route = createFileRoute('/roster/$id/')({
	component: () => {
		const { id } = Route.useParams();
		return <PlayerDetail id={id} />;
	},
});
