import { createFileRoute } from '@tanstack/react-router';
import { PlayerEdit } from '@/pages/PlayerEdit';

export const Route = createFileRoute('/roster/new')({
	component: PlayerEdit,
});
