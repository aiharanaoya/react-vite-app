import { Button } from '@aiharanaoya/ui';
import type { FC } from 'react';

type Props = {
	title: string;
	sub?: string;
	action?: string;
	onAction?: () => void;
	size?: number;
};

export const SectionHeader: FC<Props> = ({
	title,
	sub,
	action,
	onAction,
	size = 22,
}) => (
	<div className="flex items-center gap-3">
		<div className="flex-1">
			<div
				className="font-display font-semibold text-gray-900 uppercase tracking-[-0.01em] leading-[1.1]"
				style={{ fontSize: size }}
			>
				{title}
			</div>
			{sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
		</div>
		{action && (
			<Button variant="outline" size="sm" onClick={onAction}>
				{action}
			</Button>
		)}
	</div>
);
