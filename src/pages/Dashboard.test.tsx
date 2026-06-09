import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '@/testing/renderWithRouter';

describe('Dashboard', () => {
	test('シーズンヒーローを表示する', async () => {
		await renderWithRouter('/');
		expect(screen.getByText('Season Dashboard')).toBeInTheDocument();
		expect(screen.getByText('2026 Season')).toBeInTheDocument();
	});

	test('統計カードを4つ表示する', async () => {
		await renderWithRouter('/');
		expect(screen.getByText('Win Rate')).toBeInTheDocument();
		expect(screen.getByText('Active Roster')).toBeInTheDocument();
		expect(screen.getByText('Team AVG')).toBeInTheDocument();
		expect(screen.getByText('Total HR')).toBeInTheDocument();
	});

	test('トップ選手セクションを表示する', async () => {
		await renderWithRouter('/');
		expect(screen.getByText('Top Performers')).toBeInTheDocument();
	});

	test('試合スケジュールセクションを表示する', async () => {
		await renderWithRouter('/');
		expect(screen.getByText('Upcoming Games')).toBeInTheDocument();
	});

	test('シードデータの選手名がリーダーリストに表示される', async () => {
		await renderWithRouter('/');
		expect(screen.getByText('Shohei Ohtani')).toBeInTheDocument();
	});
});
