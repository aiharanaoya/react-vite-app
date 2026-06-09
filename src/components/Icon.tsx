import {
	ArrowLeft,
	BarChart3,
	Calendar,
	Check,
	ChevronDown,
	ChevronUp,
	Circle,
	Filter,
	LayoutDashboard,
	type LucideIcon,
	Pencil,
	Plus,
	Search,
	Target,
	Trash2,
	Trophy,
	Users,
	X,
	Zap,
} from 'lucide-react';
import type { CSSProperties, FC } from 'react';

type IconName =
	| 'dashboard'
	| 'users'
	| 'chart'
	| 'calendar'
	| 'search'
	| 'plus'
	| 'edit'
	| 'trash'
	| 'x'
	| 'arrowLeft'
	| 'arrowUp'
	| 'arrowDown'
	| 'check'
	| 'trophy'
	| 'bolt'
	| 'target'
	| 'filter'
	| 'dot';

const ICON_MAP: Record<IconName, LucideIcon> = {
	dashboard: LayoutDashboard,
	users: Users,
	chart: BarChart3,
	calendar: Calendar,
	search: Search,
	plus: Plus,
	edit: Pencil,
	trash: Trash2,
	x: X,
	arrowLeft: ArrowLeft,
	arrowUp: ChevronUp,
	arrowDown: ChevronDown,
	check: Check,
	trophy: Trophy,
	bolt: Zap,
	target: Target,
	filter: Filter,
	dot: Circle,
};

type Props = {
	name: IconName;
	size?: number;
	color?: string;
	strokeWidth?: number;
	style?: CSSProperties;
	className?: string;
	'aria-hidden'?: boolean | 'true' | 'false';
};

export const Icon: FC<Props> = ({
	name,
	size = 18,
	color = 'currentColor',
	strokeWidth = 1.75,
	style,
	className,
	'aria-hidden': ariaHidden,
}) => {
	const LucideComponent = ICON_MAP[name] ?? Circle;

	return (
		<LucideComponent
			size={size}
			color={color}
			strokeWidth={strokeWidth}
			style={style}
			className={className}
			aria-hidden={ariaHidden}
		/>
	);
};
