import { Avatar, Badge, Card, StatCard } from '@aiharanaoya/ui';
import { Link, useNavigate } from '@tanstack/react-router';
import type { FC } from 'react';
import { DarkStatCard } from '@/components/DarkStatCard';
import { SectionHeader } from '@/components/SectionHeader';
import {
	formatAverage,
	fullName,
	initials,
	usePlayerStore,
} from '@/store/players';

export const Dashboard: FC = () => {
	const { players, schedule } = usePlayerStore();
	const navigate = useNavigate();

	const active = players.filter((player) => player.status === 'Active');
	const teamBattingAverage =
		players.length > 0
			? formatAverage(
					players.reduce((total, player) => total + player.battingAverage, 0) /
						players.length,
				)
			: '.000';
	const totalHomeRuns = players.reduce(
		(total, player) => total + player.homeRuns,
		0,
	);
	const leaders = [...players]
		.sort((playerA, playerB) => playerB.battingAverage - playerA.battingAverage)
		.slice(0, 4);

	return (
		<div className="max-w-[1120px] mx-auto px-8 pt-7 pb-12">
			<div className="bg-brand rounded-2xl px-[30px] py-[26px] mb-[22px] flex items-center justify-between">
				<div>
					<div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/60 mb-2">
						2026 Season
					</div>
					<div className="font-display text-[40px] font-semibold text-white uppercase leading-none tracking-[-0.01em]">
						Season Dashboard
					</div>
					<div className="text-[13px] text-white/[72%] mt-[10px]">
						Last updated April 21, 2026 · Live data
					</div>
				</div>
				<div className="bg-white/[12%] text-white inline-flex items-center gap-[7px] px-[15px] py-[7px] rounded-[9px] text-[12px] font-bold tracking-[0.05em]">
					<span
						aria-hidden="true"
						className="w-[7px] h-[7px] bg-accent rounded-full"
					/>
					LIVE · Game 4
				</div>
			</div>

			<div className="grid grid-cols-4 gap-[14px] mb-[22px]">
				<StatCard
					label="Win Rate"
					value="73%"
					trend="4.2% vs last month"
					trendDirection="up"
				/>
				<StatCard
					label="Active Roster"
					value={active.length}
					trend={`${players.length} total players`}
				/>
				<DarkStatCard
					label="Team AVG"
					value={teamBattingAverage}
					sub="Top 5 in league"
				/>
				<StatCard
					label="Total HR"
					value={totalHomeRuns}
					trend="9 this month"
					trendDirection="up"
				/>
			</div>

			<div className="grid grid-cols-[1.2fr_1fr] gap-[18px]">
				<Card>
					<div className="px-[18px] py-4 border-b border-gray-100">
						<SectionHeader
							title="Top Performers"
							sub="Batting average leaders"
							action="View roster"
							onAction={() => navigate({ to: '/roster' })}
						/>
					</div>
					{leaders.map((player) => (
						<Link
							key={player.id}
							to="/roster/$id"
							params={{ id: player.id }}
							className="flex items-center gap-3 px-[18px] py-[11px] border-b border-gray-100 hover:bg-gray-50 no-underline"
						>
							<Avatar
								initials={initials(player)}
								color={player.color}
								size="sm"
							/>
							<div className="flex-1">
								<div className="text-[13.5px] font-semibold text-gray-900">
									{fullName(player)}
								</div>
								<div className="text-[11.5px] text-gray-400">
									{player.position} · #{player.jerseyNumber} · {player.homeRuns}{' '}
									HR · {player.runsBattedIn} RBI
								</div>
							</div>
							<div className="font-display text-2xl font-semibold text-brand leading-none">
								{formatAverage(player.battingAverage)}
							</div>
						</Link>
					))}
				</Card>

				<Card>
					<div className="px-[18px] py-4 border-b border-gray-100">
						<SectionHeader title="Upcoming Games" sub="Next 5 scheduled" />
					</div>
					{schedule.map((game) => (
						<div
							key={game.id}
							className="flex items-center px-[18px] py-[11px] border-b border-gray-100 gap-[13px]"
						>
							<div className="w-[42px] text-center">
								<div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-gray-400">
									{game.date.split(' ')[0]}
								</div>
								<div className="font-display text-2xl font-semibold text-brand leading-none">
									{game.date.split(' ')[1]}
								</div>
							</div>
							<div className="flex-1">
								<div className="text-[13px] font-semibold text-gray-900">
									vs {game.opponent}
								</div>
								<div className="text-[11.5px] text-gray-400">{game.time}</div>
							</div>
							<Badge variant={game.home ? 'blue' : 'gray'}>
								{game.home ? 'Home' : 'Away'}
							</Badge>
						</div>
					))}
				</Card>
			</div>
		</div>
	);
};
