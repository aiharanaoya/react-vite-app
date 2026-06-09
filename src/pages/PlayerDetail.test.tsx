import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '@/testing/renderWithRouter';
import { user } from '@/testing/setupTestingLibrary';

describe('PlayerDetail', () => {
	test('選手名とポジションをヒーローに表示する', async () => {
		await renderWithRouter('/roster/p1');
		expect(screen.getByText('Shohei Ohtani')).toBeInTheDocument();
		expect(screen.getAllByText('DH').length).toBeGreaterThan(0);
	});

	test('統計カードを表示する', async () => {
		await renderWithRouter('/roster/p1');
		expect(screen.getByText('AVG')).toBeInTheDocument();
		expect(screen.getByText('Home Runs')).toBeInTheDocument();
		expect(screen.getByText('RBI')).toBeInTheDocument();
		expect(screen.getByText('OBP')).toBeInTheDocument();
	});

	test('スキルプロファイルセクションを表示する', async () => {
		await renderWithRouter('/roster/p1');
		expect(screen.getByText('Skill Profile')).toBeInTheDocument();
	});

	test('Player Info セクションを表示する', async () => {
		await renderWithRouter('/roster/p1');
		expect(screen.getByText('Player Info')).toBeInTheDocument();
	});

	test('存在しない ID のとき "Player not found" を表示する', async () => {
		await renderWithRouter('/roster/nonexistent');
		expect(screen.getByText('Player not found')).toBeInTheDocument();
	});

	test('Edit ボタンが表示される', async () => {
		await renderWithRouter('/roster/p1');
		expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
	});

	test('Remove ボタンをクリックすると削除確認モーダルが開く', async () => {
		await renderWithRouter('/roster/p1');
		await user.click(screen.getByRole('button', { name: /remove/i }));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
