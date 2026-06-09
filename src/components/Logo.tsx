import type { FC } from 'react';

type Props = {
	size?: number;
	light?: boolean;
};

export const Logo: FC<Props> = ({ size = 26, light = false }) => (
	<div
		className="flex items-baseline font-display font-bold uppercase tracking-[-0.01em] leading-none"
		style={{ fontSize: size }}
	>
		<span className={light ? 'text-white' : 'text-brand'}>Baseball</span>
		<span className="text-accent" style={{ marginLeft: size * 0.08 }}>
			Ops
		</span>
	</div>
);
