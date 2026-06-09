import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { user } from '@/testing/setupTestingLibrary';
import { PlayerForm } from './PlayerForm';

const renderForm = (initial?: Parameters<typeof PlayerForm>[0]['initial']) => {
	const onSubmit = vi.fn();
	const onCancel = vi.fn();
	render(
		<PlayerForm onSubmit={onSubmit} onCancel={onCancel} initial={initial} />,
	);
	return { onSubmit, onCancel };
};

describe('PlayerForm バリデーション', () => {
	test('必須フィールドが空のまま送信するとエラーを表示する', async () => {
		const { onSubmit } = renderForm();

		await user.click(screen.getByRole('button', { name: 'Add player' }));

		expect(screen.getByText('First name is required')).toBeInTheDocument();
		expect(screen.getByText('Last name is required')).toBeInTheDocument();
		expect(screen.getByText('Select a position')).toBeInTheDocument();
		expect(screen.getByText('Jersey number required')).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	test('背番号が 0–99 の範囲外だとエラーを表示する', async () => {
		const { onSubmit } = renderForm();

		await user.type(screen.getByLabelText(/first name/i), 'Taro');
		await user.type(screen.getByLabelText(/last name/i), 'Yamada');
		await user.type(screen.getByLabelText(/jersey/i), '100');

		await user.click(screen.getByRole('button', { name: 'Add player' }));

		expect(screen.getByText('Must be 0–99')).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	test('打率が 1 を超えるとエラーを表示する', async () => {
		const { onSubmit } = renderForm();

		await user.type(screen.getByLabelText(/first name/i), 'Taro');
		await user.type(screen.getByLabelText(/last name/i), 'Yamada');
		await user.type(screen.getByLabelText(/jersey/i), '42');
		await user.type(screen.getByLabelText(/avg/i), '1.5');

		await user.click(screen.getByRole('button', { name: 'Add player' }));

		expect(screen.getByText('Avg must be 0–1.000')).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	test('HR に負の値を入力するとエラーを表示する', async () => {
		const { onSubmit } = renderForm();

		await user.type(screen.getByLabelText(/first name/i), 'Taro');
		await user.type(screen.getByLabelText(/last name/i), 'Yamada');
		await user.selectOptions(screen.getByLabelText(/position/i), 'P');
		await user.type(screen.getByLabelText(/jersey/i), '42');
		await user.type(screen.getByLabelText(/^hr$/i), '-1');

		await user.click(screen.getByRole('button', { name: 'Add player' }));

		expect(screen.getByText('Must be a whole number ≥ 0')).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	test('RBI に小数を入力するとエラーを表示する', async () => {
		const { onSubmit } = renderForm();

		await user.type(screen.getByLabelText(/first name/i), 'Taro');
		await user.type(screen.getByLabelText(/last name/i), 'Yamada');
		await user.selectOptions(screen.getByLabelText(/position/i), 'P');
		await user.type(screen.getByLabelText(/jersey/i), '42');
		await user.type(screen.getByLabelText(/^rbi$/i), '3.5');

		await user.click(screen.getByRole('button', { name: 'Add player' }));

		expect(
			screen.getAllByText('Must be a whole number ≥ 0').length,
		).toBeGreaterThan(0);
		expect(onSubmit).not.toHaveBeenCalled();
	});

	test('OBP が 1 を超えるとエラーを表示する', async () => {
		const { onSubmit } = renderForm();

		await user.type(screen.getByLabelText(/first name/i), 'Taro');
		await user.type(screen.getByLabelText(/last name/i), 'Yamada');
		await user.selectOptions(screen.getByLabelText(/position/i), 'P');
		await user.type(screen.getByLabelText(/jersey/i), '42');
		await user.type(screen.getByLabelText(/^obp$/i), '1.5');

		await user.click(screen.getByRole('button', { name: 'Add player' }));

		expect(screen.getByText('OBP must be 0–1.000')).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	test('正しい値で送信すると onSubmit が呼ばれる', async () => {
		const { onSubmit } = renderForm();

		await user.type(screen.getByLabelText(/first name/i), 'Taro');
		await user.type(screen.getByLabelText(/last name/i), 'Yamada');
		await user.selectOptions(screen.getByLabelText(/position/i), 'P');
		await user.type(screen.getByLabelText(/jersey/i), '42');

		await user.click(screen.getByRole('button', { name: 'Add player' }));

		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({
				first: 'Taro',
				last: 'Yamada',
				jerseyNumber: 42,
			}),
		);
	});

	test('Cancel ボタンで onCancel が呼ばれる', async () => {
		const { onCancel } = renderForm();

		await user.click(screen.getByRole('button', { name: 'Cancel' }));

		expect(onCancel).toHaveBeenCalledOnce();
	});
});

describe('PlayerForm 編集モード', () => {
	const initial = {
		first: 'Shohei',
		last: 'Ohtani',
		position: 'DH',
		jerseyNumber: 17,
		bats: 'L',
		battingAverage: 0.342,
		homeRuns: 28,
		runsBattedIn: 89,
		onBasePercentage: 0.412,
		status: 'Active' as const,
	};

	test('初期値がフォームに表示される', () => {
		renderForm(initial);

		expect(screen.getByDisplayValue('Shohei')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Ohtani')).toBeInTheDocument();
		expect(screen.getByDisplayValue('17')).toBeInTheDocument();
	});

	test('送信ボタンのラベルが "Save changes" になる', () => {
		renderForm(initial);
		expect(
			screen.getByRole('button', { name: 'Save changes' }),
		).toBeInTheDocument();
	});
});
