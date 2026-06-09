import {
	Avatar,
	Badge,
	Button,
	Card,
	EmptyState,
	Modal,
	ProgressBar,
} from '@aiharanaoya/ui';
import { useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { SectionHeader } from '@/components/SectionHeader';
import {
	formatAverage,
	fullName,
	initials,
	usePlayerStore,
} from '@/store/players';

type Props = {
	id: string;
};

export const PlayerDetail: FC<Props> = ({ id }) => {
	const { players, deletePlayer } = usePlayerStore();
	const navigate = useNavigate();
	const player = players.find((player) => player.id === id);
	const [confirmDel, setConfirmDel] = useState(false);

	if (!player) {
		return (
			<div className="max-w-[1120px] mx-auto px-8 pt-7">
				<Button variant="ghost" onClick={() => navigate({ to: '/roster' })}>
					<Icon name="arrowLeft" size={16} />
					Back to roster
				</Button>
				<EmptyState
					variant="no-data"
					title="Player not found"
					body="This player may have been removed"
				/>
			</div>
		);
	}

	const statusVariant =
		player.status === 'Active'
			? 'green'
			: player.status === 'Injured'
				? 'red'
				: 'yellow';

	const bigStats = [
		{
			label: 'AVG',
			value: formatAverage(player.battingAverage),
			primary: true,
		},
		{ label: 'Home Runs', value: player.homeRuns, primary: false },
		{ label: 'RBI', value: player.runsBattedIn, primary: false },
		{
			label: 'OBP',
			value: formatAverage(player.onBasePercentage),
			primary: false,
		},
	];

	const skills = [
		{ label: 'Contact', score: Math.min(100, player.battingAverage * 250) },
		{ label: 'Power', score: Math.min(100, player.homeRuns * 3) },
		{
			label: 'Run production',
			score: Math.min(100, player.runsBattedIn * 1.05),
		},
		{ label: 'On-base', score: Math.min(100, player.onBasePercentage * 220) },
	];

	return (
		<div className="max-w-[1120px] mx-auto px-8 pt-6 pb-12">
			<button
				type="button"
				onClick={() => navigate({ to: '/roster' })}
				aria-label="Back to roster"
				className="inline-flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-gray-500 text-[13px] font-semibold p-1 mb-4"
			>
				<Icon name="arrowLeft" size={16} aria-hidden="true" />
				Back to roster
			</button>

			<div
				className="rounded-2xl px-8 py-7 relative overflow-hidden mb-5"
				style={{ background: player.color }}
			>
				<div className="absolute right-6 -top-5 font-display text-[200px] font-bold text-white/[10%] leading-none select-none">
					{player.jerseyNumber}
				</div>
				<div className="flex items-center gap-5 relative z-10">
					<Avatar
						initials={initials(player)}
						color="rgba(255,255,255,0.15)"
						size="xl"
					/>
					<div className="flex-1">
						<div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/60">
							#{player.jerseyNumber} · {player.position} · Bats {player.bats}
						</div>
						<div className="font-display text-[44px] font-semibold text-white uppercase leading-none mt-1">
							{fullName(player)}
						</div>
						<div className="mt-[10px]">
							<Badge variant={statusVariant}>● {player.status}</Badge>
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							variant="dark"
							className="bg-white/[16%]!"
							onClick={() =>
								navigate({ to: '/roster/$id/edit', params: { id: player.id } })
							}
						>
							<Icon name="edit" size={15} />
							Edit
						</Button>
						<Button
							variant="dark"
							className="bg-accent/90!"
							onClick={() => setConfirmDel(true)}
						>
							<Icon name="trash" size={15} />
							Remove
						</Button>
					</div>
				</div>
			</div>

			<div className="flex gap-[14px] mb-5 flex-wrap">
				{bigStats.map((stat) => (
					<div
						key={stat.label}
						className="flex-1 min-w-[130px] bg-white border border-gray-200 rounded-xl px-5 py-[18px] shadow-[0_1px_3px_rgba(0,0,0,0.07)]"
					>
						<div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-1.5">
							{stat.label}
						</div>
						<div
							className={`font-display text-[42px] font-semibold leading-[0.95] ${stat.primary ? 'text-brand' : 'text-gray-900'}`}
						>
							{stat.value}
						</div>
					</div>
				))}
			</div>

			<div className="grid grid-cols-2 gap-[18px]">
				<Card>
					<div className="px-[18px] py-4 border-b border-gray-100">
						<SectionHeader
							title="Skill Profile"
							sub="Indexed 0–100 vs league"
						/>
					</div>
					<div className="px-5 py-[18px] flex flex-col gap-4">
						{skills.map((skill) => (
							<ProgressBar
								key={skill.label}
								label={skill.label}
								value={Math.round(skill.score)}
								showValue
								variant="gradient"
							/>
						))}
					</div>
				</Card>

				<Card>
					<div className="px-[18px] py-4 border-b border-gray-100">
						<SectionHeader title="Player Info" />
					</div>
					<div className="px-5 py-1.5 pb-[14px]">
						{(
							[
								['Position', player.position],
								['Jersey number', `#${player.jerseyNumber}`],
								[
									'Bats',
									player.bats === 'L'
										? 'Left'
										: player.bats === 'R'
											? 'Right'
											: 'Switch',
								],
								['Status', player.status],
								['Home runs', player.homeRuns],
								['Runs batted in', player.runsBattedIn],
							] as [string, string | number][]
						).map(([label, value]) => (
							<div
								key={label}
								className="flex justify-between py-[11px] border-b border-gray-100"
							>
								<span className="text-[13px] text-gray-500">{label}</span>
								<span className="text-[13px] font-semibold text-gray-900">
									{value}
								</span>
							</div>
						))}
					</div>
				</Card>
			</div>

			<Modal
				isOpen={confirmDel}
				onClose={() => setConfirmDel(false)}
				title="Remove player"
				footer={
					<div className="flex justify-end gap-[10px]">
						<Button variant="ghost" onClick={() => setConfirmDel(false)}>
							Cancel
						</Button>
						<Button
							variant="accent"
							onClick={() => {
								setConfirmDel(false);
								deletePlayer(player.id);
								navigate({ to: '/roster' });
							}}
						>
							<Icon name="trash" size={15} />
							Remove player
						</Button>
					</div>
				}
			>
				<p className="text-[13.5px] text-gray-600 leading-relaxed">
					Remove <strong>{fullName(player)}</strong> from the roster? This
					action cannot be undone.
				</p>
			</Modal>
		</div>
	);
};
