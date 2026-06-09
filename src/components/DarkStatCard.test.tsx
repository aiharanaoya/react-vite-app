import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { DarkStatCard } from './DarkStatCard';

describe('DarkStatCard', () => {
	test('ラベルと値を表示する', () => {
		render(<DarkStatCard label="Team AVG" value=".312" />);
		expect(screen.getByText('Team AVG')).toBeInTheDocument();
		expect(screen.getByText('.312')).toBeInTheDocument();
	});

	test('sub を渡すとサブテキストを表示する', () => {
		render(
			<DarkStatCard label="Team AVG" value=".312" sub="Top 5 in league" />,
		);
		expect(screen.getByText('Top 5 in league')).toBeInTheDocument();
	});

	test('sub を渡さないとサブテキストは表示されない', () => {
		render(<DarkStatCard label="Team AVG" value=".312" />);
		expect(screen.queryByText('Top 5 in league')).not.toBeInTheDocument();
	});

	test('数値の value も表示できる', () => {
		render(<DarkStatCard label="HR" value={42} />);
		expect(screen.getByText('42')).toBeInTheDocument();
	});
});
