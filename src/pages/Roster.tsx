import {
	Avatar,
	Badge,
	Button,
	Card,
	EmptyState,
	Modal,
} from '@aiharanaoya/ui';
import { Link, useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { useState } from 'react';
import { Icon } from '@/components/Icon';
import type { Player } from '@/store/players';
import {
	formatAverage,
	fullName,
	initials,
	usePlayerStore,
} from '@/store/players';

const STATUSES = ['All', 'Active', 'Injured', 'Minors'] as const;
type SortKey =
	| 'jerseyNumber'
	| 'name'
	| 'position'
	| 'battingAverage'
	| 'homeRuns'
	| 'runsBattedIn';

const ROSTER_GRID_COLS = 'grid-cols-[50px_1fr_64px_70px_56px_56px_100px_80px]';

const statusBadge = (status: Player['status']) => {
	if (status === 'Active')
		return (
			<Badge variant="green">
				<span aria-hidden="true">● </span>Active
			</Badge>
		);
	if (status === 'Injured')
		return (
			<Badge variant="red">
				<span aria-hidden="true">● </span>IL
			</Badge>
		);
	return (
		<Badge variant="yellow">
			<span aria-hidden="true">● </span>Minors
		</Badge>
	);
};

export const Roster: FC = () => {
	const { players, deletePlayer } = usePlayerStore();
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] =
		useState<(typeof STATUSES)[number]>('All');
	const [sort, setSort] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>(
		{
			key: 'jerseyNumber',
			direction: 'asc',
		},
	);
	const [confirmDel, setConfirmDel] = useState<Player | null>(null);

	const toggleSort = (key: SortKey) =>
		setSort((previousSort) =>
			previousSort.key === key
				? { key, direction: previousSort.direction === 'asc' ? 'desc' : 'asc' }
				: { key, direction: 'asc' },
		);

	const filtered = players
		.filter(
			(player) => statusFilter === 'All' || player.status === statusFilter,
		)
		.filter(
			(player) =>
				fullName(player).toLowerCase().includes(search.toLowerCase()) ||
				player.position.toLowerCase().includes(search.toLowerCase()),
		)
		.sort((playerA, playerB) => {
			const valueA: string | number =
				sort.key === 'name' ? fullName(playerA) : playerA[sort.key];
			const valueB: string | number =
				sort.key === 'name' ? fullName(playerB) : playerB[sort.key];
			if (typeof valueA === 'string' && typeof valueB === 'string')
				return sort.direction === 'asc'
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			return sort.direction === 'asc'
				? (valueA as number) - (valueB as number)
				: (valueB as number) - (valueA as number);
		});

	const columnDefs = [
		{ key: 'jerseyNumber', label: '#' },
		{ key: 'name', label: 'Player' },
		{ key: 'position', label: 'Pos' },
		{ key: 'battingAverage', label: 'AVG' },
		{ key: 'homeRuns', label: 'HR' },
		{ key: 'runsBattedIn', label: 'RBI' },
		{ key: 'status', label: 'Status' },
		{ key: '_act', label: '' },
	];

	return (
		<div className="max-w-[1120px] mx-auto px-8 pt-7 pb-12">
			<div className="flex items-end gap-3 mb-5 flex-wrap">
				<div className="flex-1 min-w-[200px]">
					<div className="font-display text-[34px] font-semibold text-gray-900 uppercase leading-none">
						Roster
					</div>
					<div className="text-[13px] text-gray-400 mt-1">
						2026 active roster · {players.length} players
					</div>
				</div>
				<Button
					variant="accent"
					onClick={() => navigate({ to: '/roster/new' })}
				>
					<Icon name="plus" size={15} aria-hidden="true" />
					Add player
				</Button>
			</div>

			<div className="flex gap-3 mb-4 flex-wrap items-center">
				<div className="relative flex-1 min-w-[220px]">
					<Icon
						name="search"
						size={16}
						color="#9CA3AF"
						aria-hidden="true"
						className="absolute left-3 top-1/2 -translate-y-1/2"
					/>
					<input
						id="roster-search"
						aria-label="Search players by name or position"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search by name or position…"
						className="w-full py-[9px] pr-3 pl-9 rounded-lg border border-[1.5px] border-gray-300 text-sm outline-none bg-white"
					/>
				</div>
				<fieldset className="flex gap-1 bg-gray-100 p-1 rounded-[10px] border-none m-0">
					<legend className="sr-only">Filter by status</legend>
					{STATUSES.map((statusOption) => (
						<button
							key={statusOption}
							type="button"
							aria-pressed={statusFilter === statusOption}
							onClick={() => setStatusFilter(statusOption)}
							className={[
								'px-[14px] py-1.5 rounded-[7px] border-none text-[12.5px] font-semibold cursor-pointer transition-all duration-150',
								statusFilter === statusOption
									? 'bg-white text-brand shadow-[0_1px_2px_rgba(0,0,0,0.08)]'
									: 'bg-transparent text-gray-500',
							].join(' ')}
						>
							{statusOption}
						</button>
					))}
				</fieldset>
			</div>

			<Card>
				<div>
					<div
						className={`grid ${ROSTER_GRID_COLS} px-[18px] py-[11px] border-b-2 border-gray-200 bg-gray-50`}
					>
						{columnDefs.map((column) => {
							const isActiveColumn = sort.key === column.key;
							return column.key !== '_act' && column.key !== 'status' ? (
								<button
									key={column.key}
									type="button"
									onClick={() => toggleSort(column.key as SortKey)}
									className={[
										'text-[10px] font-bold tracking-[0.08em] uppercase flex items-center gap-[3px] select-none cursor-pointer bg-transparent border-none p-0',
										isActiveColumn ? 'text-brand' : 'text-gray-400',
									].join(' ')}
								>
									{column.label}
									{isActiveColumn && (
										<Icon
											name={sort.direction === 'asc' ? 'arrowUp' : 'arrowDown'}
											size={12}
											color="#005A9C"
											aria-hidden="true"
										/>
									)}
								</button>
							) : (
								<div
									key={column.key}
									className="text-[10px] font-bold tracking-[0.08em] uppercase text-gray-400 select-none"
								>
									{column.label}
								</div>
							);
						})}
					</div>

					{filtered.length === 0 ? (
						<EmptyState
							variant="no-results"
							title="No players found"
							body="Try a different search or filter"
						/>
					) : (
						filtered.map((player) => (
							<Link
								key={player.id}
								to="/roster/$id"
								params={{ id: player.id }}
								aria-label={`View ${fullName(player)} details`}
								className={`grid ${ROSTER_GRID_COLS} px-[18px] py-3 border-b border-gray-100 items-center hover:bg-gray-50 no-underline`}
							>
								<div className="font-display text-[20px] font-semibold text-gray-300">
									{player.jerseyNumber}
								</div>
								<div className="flex items-center gap-[11px]">
									<Avatar
										initials={initials(player)}
										color={player.color}
										size="sm"
									/>
									<div>
										<div className="text-[13.5px] font-semibold text-gray-900">
											{fullName(player)}
										</div>
										<div className="text-[11px] text-gray-400">
											Bats {player.bats}
										</div>
									</div>
								</div>
								<div className="text-[13px] text-gray-600 font-semibold">
									{player.position}
								</div>
								<div className="text-[13px] font-semibold text-gray-900">
									{formatAverage(player.battingAverage)}
								</div>
								<div className="text-[13px] font-semibold text-gray-900">
									{player.homeRuns}
								</div>
								<div className="text-[13px] font-semibold text-gray-900">
									{player.runsBattedIn}
								</div>
								<div>{statusBadge(player.status)}</div>
								<div className="flex gap-1 justify-end">
									<button
										type="button"
										aria-label={`Edit ${fullName(player)}`}
										onClick={(event) => {
											event.preventDefault();
											navigate({
												to: '/roster/$id/edit',
												params: { id: player.id },
											});
										}}
										className="bg-transparent border border-gray-200 rounded-[7px] p-1.5 cursor-pointer text-gray-500 flex hover:text-brand hover:border-brand transition-colors duration-150"
									>
										<Icon name="edit" size={15} aria-hidden="true" />
									</button>
									<button
										type="button"
										aria-label={`Delete ${fullName(player)}`}
										onClick={(event) => {
											event.preventDefault();
											setConfirmDel(player);
										}}
										className="bg-transparent border border-gray-200 rounded-[7px] p-1.5 cursor-pointer text-gray-500 flex hover:text-accent hover:border-accent transition-colors duration-150"
									>
										<Icon name="trash" size={15} aria-hidden="true" />
									</button>
								</div>
							</Link>
						))
					)}
				</div>
			</Card>

			<div className="text-xs text-gray-400 mt-3 text-right">
				Showing {filtered.length} of {players.length} players
			</div>

			<Modal
				isOpen={!!confirmDel}
				onClose={() => setConfirmDel(null)}
				title="Remove player"
				footer={
					<div className="flex justify-end gap-[10px]">
						<Button variant="ghost" onClick={() => setConfirmDel(null)}>
							Cancel
						</Button>
						<Button
							variant="accent"
							onClick={() => {
								if (confirmDel) {
									deletePlayer(confirmDel.id);
									setConfirmDel(null);
								}
							}}
						>
							<Icon name="trash" size={15} />
							Remove player
						</Button>
					</div>
				}
			>
				{confirmDel && (
					<div>
						<div className="flex items-center gap-3 mb-4">
							<Avatar
								initials={initials(confirmDel)}
								color={confirmDel.color}
								size="md"
							/>
							<div>
								<div className="text-[15px] font-semibold text-gray-900">
									{fullName(confirmDel)}
								</div>
								<div className="text-[12.5px] text-gray-400">
									{confirmDel.position} · #{confirmDel.jerseyNumber}
								</div>
							</div>
						</div>
						<p className="text-[13.5px] text-gray-600 leading-relaxed">
							Remove this player from the roster? This action cannot be undone.
						</p>
					</div>
				)}
			</Modal>
		</div>
	);
};
