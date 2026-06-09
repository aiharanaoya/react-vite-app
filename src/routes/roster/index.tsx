import { createFileRoute } from '@tanstack/react-router';
import { Roster } from '@/pages/Roster';

export const Route = createFileRoute('/roster/')({
	component: Roster,
});
