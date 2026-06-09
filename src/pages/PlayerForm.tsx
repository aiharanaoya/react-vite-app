import { Button, Input, Select } from '@aiharanaoya/ui';
import type { FC } from 'react';
import { useState } from 'react';
import type { Player } from '@/store/players';

const POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
const STATUSES: Player['status'][] = ['Active', 'Injured', 'Minors'];
const BATS = ['L', 'R', 'S'];

type FormData = {
	first: string;
	last: string;
	position: string;
	jerseyNumber: string;
	bats: string;
	status: string;
	battingAverage: string;
	homeRuns: string;
	runsBattedIn: string;
	onBasePercentage: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

type Props = {
	initial?: Omit<Player, 'id' | 'color'> | null;
	onSubmit: (data: Omit<Player, 'id' | 'color'>) => void;
	onCancel: () => void;
};

const parseNonNegativeInt = (raw: string): number | null => {
	if (raw === '') return 0;
	const parsed = Number(raw);
	return Number.isNaN(parsed) || parsed < 0 || !Number.isInteger(parsed)
		? null
		: parsed;
};

const parseRate = (raw: string): number | null => {
	if (raw === '') return 0;
	const parsed = Number(raw);
	return Number.isNaN(parsed) || parsed < 0 || parsed > 1 ? null : parsed;
};

export const PlayerForm: FC<Props> = ({ initial, onSubmit, onCancel }) => {
	const [form, setForm] = useState<FormData>(
		initial
			? {
					first: initial.first,
					last: initial.last,
					position: initial.position,
					jerseyNumber: String(initial.jerseyNumber),
					bats: initial.bats,
					status: initial.status,
					battingAverage: String(initial.battingAverage),
					homeRuns: String(initial.homeRuns),
					runsBattedIn: String(initial.runsBattedIn),
					onBasePercentage: String(initial.onBasePercentage),
				}
			: {
					first: '',
					last: '',
					position: '',
					jerseyNumber: '',
					bats: 'R',
					status: 'Active',
					battingAverage: '',
					homeRuns: '',
					runsBattedIn: '',
					onBasePercentage: '',
				},
	);
	const [errors, setErrors] = useState<Errors>({});

	const setField =
		(field: keyof FormData) =>
		(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
			setForm((currentForm) => ({
				...currentForm,
				[field]: event.target.value,
			}));

	const validate = (): boolean => {
		const newErrors: Errors = {};
		if (!form.first.trim()) newErrors.first = 'First name is required';
		if (!form.last.trim()) newErrors.last = 'Last name is required';
		if (!form.position) newErrors.position = 'Select a position';

		const jerseyNumber = Number(form.jerseyNumber);
		if (form.jerseyNumber === '' || Number.isNaN(jerseyNumber))
			newErrors.jerseyNumber = 'Jersey number required';
		else if (
			!Number.isInteger(jerseyNumber) ||
			jerseyNumber < 0 ||
			jerseyNumber > 99
		)
			newErrors.jerseyNumber = 'Must be 0–99';

		if (form.battingAverage !== '' && parseRate(form.battingAverage) === null)
			newErrors.battingAverage = 'Avg must be 0–1.000';

		if (parseNonNegativeInt(form.homeRuns) === null)
			newErrors.homeRuns = 'Must be a whole number ≥ 0';

		if (parseNonNegativeInt(form.runsBattedIn) === null)
			newErrors.runsBattedIn = 'Must be a whole number ≥ 0';

		if (
			form.onBasePercentage !== '' &&
			parseRate(form.onBasePercentage) === null
		)
			newErrors.onBasePercentage = 'OBP must be 0–1.000';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!validate()) return;
		onSubmit({
			first: form.first.trim(),
			last: form.last.trim(),
			position: form.position,
			jerseyNumber: Number(form.jerseyNumber),
			bats: form.bats,
			status: form.status as Player['status'],
			battingAverage: parseRate(form.battingAverage) ?? 0,
			homeRuns: parseNonNegativeInt(form.homeRuns) ?? 0,
			runsBattedIn: parseNonNegativeInt(form.runsBattedIn) ?? 0,
			onBasePercentage: parseRate(form.onBasePercentage) ?? 0,
		});
	};

	return (
		<form onSubmit={handleSubmit} noValidate>
			<div className="grid grid-cols-2 gap-[14px]">
				<Input
					id="first"
					label="First name"
					value={form.first}
					onChange={setField('first')}
					placeholder="Shohei"
					error={errors.first}
					aria-invalid={!!errors.first}
					required
				/>
				<Input
					id="last"
					label="Last name"
					value={form.last}
					onChange={setField('last')}
					placeholder="Ohtani"
					error={errors.last}
					aria-invalid={!!errors.last}
					required
				/>
				<Select
					id="pos"
					label="Position"
					value={form.position}
					onChange={setField('position')}
					error={errors.position}
					aria-invalid={!!errors.position}
					required
				>
					<option value="" disabled>
						Select position
					</option>
					{POSITIONS.map((position) => (
						<option key={position} value={position}>
							{position}
						</option>
					))}
				</Select>
				<Input
					id="num"
					label="Jersey #"
					type="number"
					value={form.jerseyNumber}
					onChange={setField('jerseyNumber')}
					placeholder="17"
					error={errors.jerseyNumber}
					aria-invalid={!!errors.jerseyNumber}
					required
				/>
				<Select
					id="bats"
					label="Bats"
					value={form.bats}
					onChange={setField('bats')}
				>
					{BATS.map((bat) => (
						<option key={bat} value={bat}>
							{bat}
						</option>
					))}
				</Select>
				<Select
					id="status"
					label="Status"
					value={form.status}
					onChange={setField('status')}
				>
					{STATUSES.map((status) => (
						<option key={status} value={status}>
							{status}
						</option>
					))}
				</Select>
			</div>
			<div className="h-px bg-gray-100 my-[18px]" />
			<fieldset className="border-none p-0 m-0">
				<legend className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 mb-3">
					Season stats
				</legend>
				<div className="grid grid-cols-4 gap-3">
					<Input
						id="ba"
						label="AVG"
						type="number"
						value={form.battingAverage}
						onChange={setField('battingAverage')}
						placeholder=".300"
						error={errors.battingAverage}
						aria-invalid={!!errors.battingAverage}
					/>
					<Input
						id="hr"
						label="HR"
						type="number"
						value={form.homeRuns}
						onChange={setField('homeRuns')}
						placeholder="0"
						error={errors.homeRuns}
						aria-invalid={!!errors.homeRuns}
					/>
					<Input
						id="rbi"
						label="RBI"
						type="number"
						value={form.runsBattedIn}
						onChange={setField('runsBattedIn')}
						placeholder="0"
						error={errors.runsBattedIn}
						aria-invalid={!!errors.runsBattedIn}
					/>
					<Input
						id="obp"
						label="OBP"
						type="number"
						value={form.onBasePercentage}
						onChange={setField('onBasePercentage')}
						placeholder=".350"
						error={errors.onBasePercentage}
						aria-invalid={!!errors.onBasePercentage}
					/>
				</div>
			</fieldset>
			<div className="flex justify-end gap-[10px] mt-[26px]">
				<Button type="button" variant="ghost" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" variant="primary">
					{initial ? 'Save changes' : 'Add player'}
				</Button>
			</div>
		</form>
	);
};
