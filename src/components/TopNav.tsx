import { Avatar } from '@aiharanaoya/ui';
import { Link, useRouterState } from '@tanstack/react-router';
import type { FC } from 'react';
import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';

const NAV = [
	{ label: 'Dashboard', to: '/', icon: 'dashboard' as const },
	{ label: 'Roster', to: '/roster', icon: 'users' as const },
];

export const TopNav: FC = () => {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	return (
		<nav
			aria-label="Main navigation"
			className="bg-brand h-[58px] flex items-center px-6 gap-1 shadow-[0_2px_8px_rgba(0,0,0,0.18)] shrink-0 sticky top-0 z-50"
		>
			<Link to="/" aria-label="BaseballOps home" className="mr-6 no-underline">
				<Logo light size={26} />
			</Link>
			{NAV.map((item) => {
				const active =
					item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
				return (
					<Link
						key={item.to}
						to={item.to}
						aria-current={active ? 'page' : undefined}
						className={[
							'inline-flex items-center gap-[7px] px-[14px] py-[7px] rounded-lg text-[13px] font-semibold no-underline transition-all duration-150',
							active
								? 'bg-white/[18%] text-white'
								: 'bg-transparent text-white/[72%]',
						].join(' ')}
					>
						<Icon name={item.icon} size={16} aria-hidden="true" />
						{item.label}
					</Link>
				);
			})}
			<div className="flex-1" />
			<Avatar initials="JD" color="rgba(255,255,255,0.18)" size="sm" />
		</nav>
	);
};
