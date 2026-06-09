import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { renderWithRouter } from '@/testing/renderWithRouter';

describe('TopNav', () => {
	test('ロゴを表示する', async () => {
		await renderWithRouter('/');
		expect(screen.getByText('Baseball')).toBeInTheDocument();
		expect(screen.getByText('Ops')).toBeInTheDocument();
	});

	test('Dashboard と Roster のナビリンクを表示する', async () => {
		await renderWithRouter('/');
		expect(
			screen.getByRole('link', { name: /dashboard/i }),
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: /roster/i })).toBeInTheDocument();
	});

	test('/ にいるとき Dashboard リンクが aria-current="page" を持つ', async () => {
		await renderWithRouter('/');
		const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
		expect(dashboardLink).toHaveAttribute('aria-current', 'page');
	});

	test('/roster にいるとき Roster リンクが aria-current="page" を持つ', async () => {
		await renderWithRouter('/roster');
		const rosterLinks = screen.getAllByRole('link', { name: /roster/i });
		const navLink = rosterLinks.find(
			(el) => el.getAttribute('href') === '/roster',
		);
		expect(navLink).toHaveAttribute('aria-current', 'page');
	});

	test('/roster にいるとき Dashboard リンクは aria-current を持たない', async () => {
		await renderWithRouter('/roster');
		const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
		expect(dashboardLink).not.toHaveAttribute('aria-current');
	});

	test('アバター "JD" を表示する', async () => {
		await renderWithRouter('/');
		expect(screen.getByRole('img', { name: 'JD' })).toBeInTheDocument();
	});
});
