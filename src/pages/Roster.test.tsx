import { screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '@/testing/renderWithRouter';
import { user } from '@/testing/setupTestingLibrary';

describe('Roster', () => {
	test('ページ固有のテキストを表示する', async () => {
		await renderWithRouter('/roster');
		expect(screen.getByText(/2026 active roster/i)).toBeInTheDocument();
	});

	test('シードデータの全選手を表示する', async () => {
		await renderWithRouter('/roster');
		expect(screen.getByText('Shohei Ohtani')).toBeInTheDocument();
		expect(screen.getByText('Mookie Betts')).toBeInTheDocument();
	});

	test('名前で検索すると絞り込まれる', async () => {
		await renderWithRouter('/roster');
		await user.type(screen.getByPlaceholderText(/search by name/i), 'Ohtani');
		expect(screen.getByText('Shohei Ohtani')).toBeInTheDocument();
		expect(screen.queryByText('Mookie Betts')).not.toBeInTheDocument();
	});

	test('ステータスフィルターで Injured のみ表示できる', async () => {
		await renderWithRouter('/roster');
		await user.click(screen.getByRole('button', { name: 'Injured' }));
		expect(screen.getByText('Teoscar Hernandez')).toBeInTheDocument();
		expect(screen.queryByText('Shohei Ohtani')).not.toBeInTheDocument();
	});

	test('"Add player" ボタンが表示される', async () => {
		await renderWithRouter('/roster');
		expect(
			screen.getByRole('button', { name: /add player/i }),
		).toBeInTheDocument();
	});

	test('選手が見つからないとき EmptyState を表示する', async () => {
		await renderWithRouter('/roster');
		await user.type(
			screen.getByPlaceholderText(/search by name/i),
			'zzznobody',
		);
		expect(screen.getByText('No players found')).toBeInTheDocument();
	});

	test('削除ボタンをクリックすると確認モーダルが開く', async () => {
		await renderWithRouter('/roster');
		await user.click(screen.getAllByRole('button', { name: /^Delete /i })[0]);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	test('削除確認モーダルで Cancel するとモーダルが閉じる', async () => {
		await renderWithRouter('/roster');
		await user.click(screen.getAllByRole('button', { name: /^Delete /i })[0]);
		await user.click(screen.getByRole('button', { name: 'Cancel' }));
		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});
});
