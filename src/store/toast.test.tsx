import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ToastProvider, useToast } from './toast';

const wrapper = ({ children }: { children: ReactNode }) => (
	<ToastProvider>{children}</ToastProvider>
);

describe('useToast', () => {
	test('初期状態では toast は null', () => {
		const { result } = renderHook(() => useToast(), { wrapper });
		expect(result.current.toast).toBeNull();
	});

	test('notify でメッセージが設定される', () => {
		const { result } = renderHook(() => useToast(), { wrapper });
		act(() => result.current.notify('Player added'));
		expect(result.current.toast?.message).toBe('Player added');
	});

	test('デフォルト variant は success', () => {
		const { result } = renderHook(() => useToast(), { wrapper });
		act(() => result.current.notify('Player added'));
		expect(result.current.toast?.variant).toBe('success');
	});

	test('error バリアントを指定できる', () => {
		const { result } = renderHook(() => useToast(), { wrapper });
		act(() => result.current.notify('Removed', 'error'));
		expect(result.current.toast?.variant).toBe('error');
	});

	test('ToastProvider 外で useToast を呼ぶとエラーをスロー', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => renderHook(() => useToast())).toThrow(
			'useToast must be used within AppProvider',
		);
		spy.mockRestore();
	});
});

describe('useToast タイマー動作', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	test('2600ms 後にトーストが自動で消える', () => {
		const { result } = renderHook(() => useToast(), { wrapper });
		act(() => result.current.notify('hello'));
		expect(result.current.toast).not.toBeNull();
		act(() => vi.advanceTimersByTime(2600));
		expect(result.current.toast).toBeNull();
	});

	test('2599ms ではまだトーストが残っている', () => {
		const { result } = renderHook(() => useToast(), { wrapper });
		act(() => result.current.notify('hello'));
		act(() => vi.advanceTimersByTime(2599));
		expect(result.current.toast).not.toBeNull();
	});

	test('連続 notify で最初のタイマーがキャンセルされ2本目が残る', () => {
		const { result } = renderHook(() => useToast(), { wrapper });
		act(() => result.current.notify('first'));
		act(() => vi.advanceTimersByTime(1000));
		act(() => result.current.notify('second'));

		// 最初のタイマーが 2600ms を超えても2本目のトーストは残る
		act(() => vi.advanceTimersByTime(1700));
		expect(result.current.toast?.message).toBe('second');

		// 2本目のタイマーが完了すると消える
		act(() => vi.advanceTimersByTime(900));
		expect(result.current.toast).toBeNull();
	});
});
