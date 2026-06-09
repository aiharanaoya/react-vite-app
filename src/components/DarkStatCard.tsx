import type { FC } from 'react';

type Props = {
	label: string;
	value: string | number;
	sub?: string;
};

export const DarkStatCard: FC<Props> = ({ label, value, sub }) => (
	<div className="bg-brand rounded-xl px-5 py-[18px] shadow-[0_4px_16px_rgba(0,90,156,0.25)]">
		<div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-white/60 mb-1.5">
			{label}
		</div>
		<div className="font-display text-[40px] font-semibold text-white leading-[0.95]">
			{value}
		</div>
		{sub && (
			<div className="text-xs text-white/80 font-semibold mt-1.5">{sub}</div>
		)}
	</div>
);
