import type { FC } from 'react';
import { Icon } from '@/components/Icon';

type Props = {
	message?: string;
	variant?: 'success' | 'error';
};

export const Toast: FC<Props> = ({ message, variant = 'success' }) => {
	if (!message) return null;
	const isError = variant === 'error';
	const dotColor = isError ? '#EF3E42' : '#16A34A';
	return (
		<div
			role={isError ? 'alert' : 'status'}
			aria-atomic="true"
			className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-navy text-white px-[18px] py-[11px] rounded-[10px] flex items-center gap-[10px] text-[13px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.25)] z-[200] whitespace-nowrap animate-slide-up"
		>
			<span
				aria-hidden="true"
				className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
				style={{ background: dotColor }}
			>
				<Icon
					name={isError ? 'x' : 'check'}
					size={12}
					color="#FFFFFF"
					strokeWidth={3}
				/>
			</span>
			{message}
		</div>
	);
};
