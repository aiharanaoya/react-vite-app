import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
	test('SVG をレンダリングする', () => {
		const { container } = render(<Icon name="search" />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	test('size prop が SVG の width/height に反映される', () => {
		const { container } = render(<Icon name="search" size={24} />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('width', '24');
		expect(svg).toHaveAttribute('height', '24');
	});

	test('color prop が stroke に反映される', () => {
		const { container } = render(<Icon name="search" color="#FF0000" />);
		const svg = container.querySelector('svg');
		expect(svg).toHaveAttribute('stroke', '#FF0000');
	});

	test('各アイコン名で SVG がレンダリングされる', () => {
		const names = [
			'dashboard',
			'users',
			'search',
			'plus',
			'edit',
			'trash',
			'x',
			'arrowLeft',
			'check',
		] as const;
		for (const name of names) {
			const { container } = render(<Icon name={name} />);
			expect(container.querySelector('svg')).toBeInTheDocument();
		}
	});
});
