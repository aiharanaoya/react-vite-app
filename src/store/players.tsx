import {
	createContext,
	type FC,
	type ReactNode,
	useContext,
	useState,
} from 'react';
import { ToastProvider, useToast } from './toast';
import type { Game, Player } from './types';

export type { Game, Player } from './types';

type StoreValue = {
	players: Player[];
	schedule: Game[];
	addPlayer: (data: Omit<Player, 'id' | 'color'>) => string;
	updatePlayer: (id: string, data: Partial<Player>) => void;
	deletePlayer: (id: string) => void;
	resetRoster: () => void;
};

const SEED_PLAYERS: Player[] = [
	{
		id: 'p1',
		first: 'Shohei',
		last: 'Ohtani',
		position: 'DH',
		jerseyNumber: 17,
		bats: 'L',
		battingAverage: 0.342,
		homeRuns: 28,
		runsBattedIn: 89,
		onBasePercentage: 0.412,
		color: '#005A9C',
		status: 'Active',
	},
	{
		id: 'p2',
		first: 'Mookie',
		last: 'Betts',
		position: 'RF',
		jerseyNumber: 50,
		bats: 'R',
		battingAverage: 0.31,
		homeRuns: 22,
		runsBattedIn: 74,
		onBasePercentage: 0.388,
		color: '#EF3E42',
		status: 'Active',
	},
	{
		id: 'p3',
		first: 'Freddie',
		last: 'Freeman',
		position: '1B',
		jerseyNumber: 5,
		bats: 'L',
		battingAverage: 0.298,
		homeRuns: 19,
		runsBattedIn: 81,
		onBasePercentage: 0.401,
		color: '#0A1628',
		status: 'Active',
	},
	{
		id: 'p4',
		first: 'Will',
		last: 'Smith',
		position: 'C',
		jerseyNumber: 16,
		bats: 'R',
		battingAverage: 0.271,
		homeRuns: 14,
		runsBattedIn: 55,
		onBasePercentage: 0.342,
		color: '#374151',
		status: 'Active',
	},
	{
		id: 'p5',
		first: 'Teoscar',
		last: 'Hernandez',
		position: 'LF',
		jerseyNumber: 37,
		bats: 'R',
		battingAverage: 0.256,
		homeRuns: 17,
		runsBattedIn: 63,
		onBasePercentage: 0.318,
		color: '#6B7280',
		status: 'Injured',
	},
	{
		id: 'p6',
		first: 'Max',
		last: 'Muncy',
		position: '3B',
		jerseyNumber: 13,
		bats: 'L',
		battingAverage: 0.231,
		homeRuns: 21,
		runsBattedIn: 68,
		onBasePercentage: 0.355,
		color: '#1A6FAF',
		status: 'Active',
	},
	{
		id: 'p7',
		first: 'Gavin',
		last: 'Lux',
		position: '2B',
		jerseyNumber: 9,
		bats: 'L',
		battingAverage: 0.268,
		homeRuns: 8,
		runsBattedIn: 41,
		onBasePercentage: 0.331,
		color: '#004880',
		status: 'Active',
	},
	{
		id: 'p8',
		first: 'James',
		last: 'Outman',
		position: 'CF',
		jerseyNumber: 33,
		bats: 'L',
		battingAverage: 0.224,
		homeRuns: 11,
		runsBattedIn: 39,
		onBasePercentage: 0.297,
		color: '#9CA3AF',
		status: 'Minors',
	},
];

const SCHEDULE: Game[] = [
	{
		id: 'g1',
		opponent: 'San Francisco Giants',
		abbreviation: 'SF',
		date: 'Apr 22',
		time: '7:10 PM',
		home: true,
	},
	{
		id: 'g2',
		opponent: 'New York Mets',
		abbreviation: 'NYM',
		date: 'Apr 24',
		time: '4:05 PM',
		home: false,
	},
	{
		id: 'g3',
		opponent: 'San Diego Padres',
		abbreviation: 'SD',
		date: 'Apr 26',
		time: '6:40 PM',
		home: false,
	},
	{
		id: 'g4',
		opponent: 'Arizona Diamondbacks',
		abbreviation: 'ARI',
		date: 'Apr 28',
		time: '7:10 PM',
		home: true,
	},
	{
		id: 'g5',
		opponent: 'Colorado Rockies',
		abbreviation: 'COL',
		date: 'Apr 30',
		time: '7:10 PM',
		home: true,
	},
];

const AVATAR_COLORS = [
	'#005A9C',
	'#EF3E42',
	'#0A1628',
	'#374151',
	'#1A6FAF',
	'#004880',
];

const StoreContext = createContext<StoreValue | null>(null);

export const usePlayerStore = () => {
	const context = useContext(StoreContext);
	if (!context)
		throw new Error('usePlayerStore must be used within AppProvider');
	return context;
};

const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { notify } = useToast();
	const [players, setPlayers] = useState<Player[]>(SEED_PLAYERS);

	const addPlayer = (data: Omit<Player, 'id' | 'color'>) => {
		const id = `p${Date.now()}`;
		const color =
			AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
		setPlayers((previousPlayers) => [
			...previousPlayers,
			{ ...data, id, color },
		]);
		notify(`${data.first} ${data.last} added to roster`);
		return id;
	};

	const updatePlayer = (id: string, data: Partial<Player>) => {
		setPlayers((previousPlayers) =>
			previousPlayers.map((player) =>
				player.id === id ? { ...player, ...data } : player,
			),
		);
		notify('Player updated');
	};

	const deletePlayer = (id: string) => {
		const foundPlayer = players.find((player) => player.id === id);
		setPlayers((previousPlayers) =>
			previousPlayers.filter((player) => player.id !== id),
		);
		notify(
			`${foundPlayer ? `${foundPlayer.first} ${foundPlayer.last}` : 'Player'} removed`,
			'error',
		);
	};

	const resetRoster = () => {
		setPlayers(SEED_PLAYERS);
		notify('Roster reset to defaults');
	};

	return (
		<StoreContext.Provider
			value={{
				players,
				schedule: SCHEDULE,
				addPlayer,
				updatePlayer,
				deletePlayer,
				resetRoster,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
};

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => (
	<ToastProvider>
		<StoreProvider>{children}</StoreProvider>
	</ToastProvider>
);

export const initials = (player: Player) =>
	(player.first.charAt(0) + player.last.charAt(0)).toUpperCase() || '?';
export const fullName = (player: Player) => `${player.first} ${player.last}`;
export const formatAverage = (average: number) =>
	average.toFixed(3).replace(/^0/, '');
