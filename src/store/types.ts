export type Player = {
	id: string;
	first: string;
	last: string;
	position: string;
	jerseyNumber: number;
	bats: string;
	battingAverage: number;
	homeRuns: number;
	runsBattedIn: number;
	onBasePercentage: number;
	color: string;
	status: 'Active' | 'Injured' | 'Minors';
};

export type Game = {
	id: string;
	opponent: string;
	abbreviation: string;
	date: string;
	time: string;
	home: boolean;
};
