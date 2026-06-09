import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Toast } from './Toast';

describe('Toast', () => {
	test('message がないと何も表示しない', () => {
		const { container } = render(<Toast />);
		expect(container).toBeEmptyDOMElement();
	});

	test('message を渡すと表示する', () => {
		render(<Toast message="Player added" />);
		expect(screen.getByText('Player added')).toBeInTheDocument();
	});

	test('画面下部に fixed 表示される', () => {
		render(<Toast message="Player added" />);
		const toast = screen.getByText('Player added').closest('div');
		expect(toast).toHaveClass('fixed', 'bottom-6');
	});

	test('success バリアントは role="status" を持つ', () => {
		render(<Toast message="Saved" variant="success" />);
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	test('error バリアントは role="alert" を持つ', () => {
		render(<Toast message="Error occurred" variant="error" />);
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	test('variant を省略すると role="status" になる', () => {
		render(<Toast message="Done" />);
		expect(screen.getByRole('status')).toBeInTheDocument();
	});
});
