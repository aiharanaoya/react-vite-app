import { Avatar, Button, Card, EmptyState } from '@aiharanaoya/ui';
import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { Icon } from '@/components/Icon';
import { PlayerForm } from '@/pages/PlayerForm';
import type { Player } from '@/store/players';
import { fullName, initials, usePlayerStore } from '@/store/players';

type Props = {
	id?: string;
};

export const PlayerEdit: FC<Props> = ({ id }) => {
	const { players, addPlayer, updatePlayer } = usePlayerStore();
	const navigate = useNavigate();
	const editing = !!id;
	const player = editing ? players.find((player) => player.id === id) : null;

	if (editing && !player) {
		return (
			<div className="max-w-[720px] mx-auto px-8 pt-7">
				<EmptyState
					variant="no-data"
					title="Player not found"
					body="This player may have been removed"
				/>
				<div className="text-center mt-4">
					<Button variant="outline" onClick={() => navigate({ to: '/roster' })}>
						Back to roster
					</Button>
				</div>
			</div>
		);
	}

	const goBack = () => {
		if (editing && id) {
			navigate({ to: '/roster/$id', params: { id } });
		} else {
			navigate({ to: '/roster' });
		}
	};

	const initial: Omit<Player, 'id' | 'color'> | null =
		editing && player
			? (({ id: _id, color: _color, ...rest }) => rest)(player)
			: null;

	const onSubmit = (data: Omit<Player, 'id' | 'color'>) => {
		if (editing && id) {
			updatePlayer(id, data);
			navigate({ to: '/roster/$id', params: { id } });
		} else {
			const newId = addPlayer(data);
			navigate({ to: '/roster/$id', params: { id: newId } });
		}
	};

	return (
		<div className="max-w-[720px] mx-auto px-8 pt-6 pb-12">
			<button
				type="button"
				onClick={goBack}
				className="inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-gray-500 text-[13px] font-semibold p-1 mb-4"
			>
				<Icon name="arrowLeft" size={16} />
				{editing ? 'Back to player' : 'Back to roster'}
			</button>

			<div className="flex items-center gap-[14px] mb-[22px]">
				{editing && player ? (
					<Avatar initials={initials(player)} color={player.color} size="md" />
				) : (
					<div className="w-12 h-12 rounded-full bg-[#EBF3FA] flex items-center justify-center">
						<Icon name="plus" size={24} color="#005A9C" />
					</div>
				)}
				<div>
					<div className="font-display text-[34px] font-semibold text-gray-900 uppercase leading-none">
						{editing ? 'Edit player' : 'Add player'}
					</div>
					<div className="text-[13px] text-gray-400 mt-1">
						{editing && player
							? `${fullName(player)} · #${player.jerseyNumber}`
							: 'Create a new roster entry'}
					</div>
				</div>
			</div>

			<Card className="p-[26px]">
				<PlayerForm initial={initial} onCancel={goBack} onSubmit={onSubmit} />
			</Card>
		</div>
	);
};
