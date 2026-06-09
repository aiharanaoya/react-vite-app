import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, test } from 'vitest';
import {
	AppProvider,
	formatAverage,
	fullName,
	initials,
	usePlayerStore,
} from './players';
import { useToast } from './toast';

const wrapper = ({ children }: { children: ReactNode }) => (
	<AppProvider>{children}</AppProvider>
);

const useStore = () => ({ ...usePlayerStore(), ...useToast() });

describe('formatAverage', () => {
	test('小数点3桁でフォーマットし先頭の0を除く', () => {
		expect(formatAverage(0.342)).toBe('.342');
	});

	test('1.0は先頭の0がないのでそのまま', () => {
		expect(formatAverage(1.0)).toBe('1.000');
	});

	test('0.3は.300になる', () => {
		expect(formatAverage(0.3)).toBe('.300');
	});
});

describe('initials', () => {
	test('名前のイニシャルを大文字で返す', () => {
		const player = { first: 'Shohei', last: 'Ohtani' } as Parameters<
			typeof initials
		>[0];
		expect(initials(player)).toBe('SO');
	});

	test('first が空文字のとき last のイニシャルだけ返す', () => {
		const player = { first: '', last: 'Ohtani' } as Parameters<
			typeof initials
		>[0];
		expect(initials(player)).toBe('O');
	});

	test('first と last が両方空文字のとき "?" を返す', () => {
		const player = { first: '', last: '' } as Parameters<typeof initials>[0];
		expect(initials(player)).toBe('?');
	});
});

describe('fullName', () => {
	test('名と姓をスペースで繋げる', () => {
		const player = { first: 'Shohei', last: 'Ohtani' } as Parameters<
			typeof fullName
		>[0];
		expect(fullName(player)).toBe('Shohei Ohtani');
	});
});

describe('usePlayerStore', () => {
	test('初期状態でシードデータが入っている', () => {
		const { result } = renderHook(() => usePlayerStore(), { wrapper });
		expect(result.current.players.length).toBeGreaterThan(0);
	});

	test('addPlayer で選手が追加される', () => {
		const { result } = renderHook(() => usePlayerStore(), { wrapper });
		const before = result.current.players.length;

		act(() => {
			result.current.addPlayer({
				first: 'Taro',
				last: 'Yamada',
				position: 'P',
				jerseyNumber: 42,
				bats: 'R',
				battingAverage: 0.3,
				homeRuns: 10,
				runsBattedIn: 30,
				onBasePercentage: 0.35,
				status: 'Active',
			});
		});

		expect(result.current.players).toHaveLength(before + 1);
		expect(result.current.players.at(-1)?.first).toBe('Taro');
	});

	test('updatePlayer で選手情報が更新される', () => {
		const { result } = renderHook(() => usePlayerStore(), { wrapper });
		const targetId = result.current.players[0].id;

		act(() => {
			result.current.updatePlayer(targetId, { homeRuns: 99 });
		});

		const updated = result.current.players.find(
			(player) => player.id === targetId,
		);
		expect(updated?.homeRuns).toBe(99);
	});

	test('deletePlayer で選手が削除される', () => {
		const { result } = renderHook(() => usePlayerStore(), { wrapper });
		const before = result.current.players.length;
		const targetId = result.current.players[0].id;

		act(() => {
			result.current.deletePlayer(targetId);
		});

		expect(result.current.players).toHaveLength(before - 1);
		expect(
			result.current.players.find((player) => player.id === targetId),
		).toBeUndefined();
	});

	test('addPlayer 後にトーストが表示される', () => {
		const { result } = renderHook(useStore, { wrapper });

		act(() => {
			result.current.addPlayer({
				first: 'Taro',
				last: 'Yamada',
				position: 'P',
				jerseyNumber: 42,
				bats: 'R',
				battingAverage: 0.3,
				homeRuns: 10,
				runsBattedIn: 30,
				onBasePercentage: 0.35,
				status: 'Active',
			});
		});

		expect(result.current.toast?.message).toContain('Taro Yamada');
		expect(result.current.toast?.variant).toBe('success');
	});

	test('deletePlayer 後にエラートーストが表示される', () => {
		const { result } = renderHook(useStore, { wrapper });
		const targetId = result.current.players[0].id;

		act(() => {
			result.current.deletePlayer(targetId);
		});

		expect(result.current.toast?.variant).toBe('error');
	});

	test('resetRoster で選手がシードデータに戻る', () => {
		const { result } = renderHook(() => usePlayerStore(), { wrapper });
		const original = result.current.players.length;

		act(() => {
			result.current.deletePlayer(result.current.players[0].id);
		});
		act(() => {
			result.current.deletePlayer(result.current.players[0].id);
		});

		expect(result.current.players.length).toBe(original - 2);

		act(() => {
			result.current.resetRoster();
		});

		expect(result.current.players.length).toBe(original);
		expect(result.current.players[0].id).toBe('p1');
	});
});
