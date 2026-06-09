import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { user } from '@/testing/setupTestingLibrary';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
	test('タイトルを表示する', () => {
		render(<SectionHeader title="Top Performers" />);
		expect(screen.getByText('Top Performers')).toBeInTheDocument();
	});

	test('sub を渡すとサブタイトルを表示する', () => {
		render(
			<SectionHeader title="Top Performers" sub="Batting average leaders" />,
		);
		expect(screen.getByText('Batting average leaders')).toBeInTheDocument();
	});

	test('sub を渡さないとサブタイトルは表示されない', () => {
		render(<SectionHeader title="Top Performers" />);
		expect(
			screen.queryByText('Batting average leaders'),
		).not.toBeInTheDocument();
	});

	test('action を渡すとボタンが表示される', () => {
		render(
			<SectionHeader
				title="Top Performers"
				action="View roster"
				onAction={vi.fn()}
			/>,
		);
		expect(
			screen.getByRole('button', { name: 'View roster' }),
		).toBeInTheDocument();
	});

	test('action ボタンをクリックすると onAction が呼ばれる', async () => {
		const onAction = vi.fn();
		render(
			<SectionHeader
				title="Top Performers"
				action="View roster"
				onAction={onAction}
			/>,
		);
		await user.click(screen.getByRole('button', { name: 'View roster' }));
		expect(onAction).toHaveBeenCalledOnce();
	});

	test('action を渡さないとボタンは表示されない', () => {
		render(<SectionHeader title="Top Performers" />);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});
});
