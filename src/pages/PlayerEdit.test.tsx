import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '@/testing/renderWithRouter';

describe('PlayerEdit (新規作成)', () => {
	test('"Create a new roster entry" サブタイトルを表示する', async () => {
		await renderWithRouter('/roster/new');
		expect(screen.getByText('Create a new roster entry')).toBeInTheDocument();
	});

	test('フォームの入力フィールドを表示する', async () => {
		await renderWithRouter('/roster/new');
		expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
	});

	test('"Back to roster" リンクを表示する', async () => {
		await renderWithRouter('/roster/new');
		expect(screen.getByText('Back to roster')).toBeInTheDocument();
	});
});

describe('PlayerEdit (編集)', () => {
	test('"Edit player" タイトルを表示する', async () => {
		await renderWithRouter('/roster/p1/edit');
		expect(screen.getByText('Edit player')).toBeInTheDocument();
	});

	test('選手名をサブタイトルに表示する', async () => {
		await renderWithRouter('/roster/p1/edit');
		expect(screen.getByText(/Shohei Ohtani/)).toBeInTheDocument();
	});

	test('現在の値がフォームにセットされている', async () => {
		await renderWithRouter('/roster/p1/edit');
		expect(screen.getByDisplayValue('Shohei')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Ohtani')).toBeInTheDocument();
	});

	test('"Save changes" ボタンを表示する', async () => {
		await renderWithRouter('/roster/p1/edit');
		expect(
			screen.getByRole('button', { name: 'Save changes' }),
		).toBeInTheDocument();
	});

	test('存在しない ID のとき "Player not found" を表示する', async () => {
		await renderWithRouter('/roster/nonexistent/edit');
		expect(screen.getByText('Player not found')).toBeInTheDocument();
	});
});
