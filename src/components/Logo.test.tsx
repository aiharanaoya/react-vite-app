import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Logo } from './Logo';

describe('Logo', () => {
	test('"Baseball" と "Ops" を表示する', () => {
		render(<Logo />);
		expect(screen.getByText('Baseball')).toBeInTheDocument();
		expect(screen.getByText('Ops')).toBeInTheDocument();
	});

	test('light=true のとき "Baseball" が text-white クラスを持つ', () => {
		render(<Logo light />);
		expect(screen.getByText('Baseball')).toHaveClass('text-white');
	});

	test('light=false のとき "Baseball" が text-brand クラスを持つ', () => {
		render(<Logo />);
		expect(screen.getByText('Baseball')).toHaveClass('text-brand');
	});

	test('"Ops" は常に text-accent クラスを持つ', () => {
		render(<Logo />);
		expect(screen.getByText('Ops')).toHaveClass('text-accent');
	});
});
