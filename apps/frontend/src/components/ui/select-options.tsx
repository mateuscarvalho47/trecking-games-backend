import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const CLEAR_SENTINEL = "__none__";

interface SelectOptionsProps {
	options: string[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	allowClear?: boolean;
	clearLabel?: string;
	className?: string;
}

export function SelectOptions({
	options,
	value,
	onChange,
	placeholder = "Selecionar",
	allowClear = false,
	clearLabel = "—",
	className,
}: SelectOptionsProps) {
	const selectValue = allowClear ? value || CLEAR_SENTINEL : value;

	function handleChange(v: string) {
		onChange(allowClear && v === CLEAR_SENTINEL ? "" : v);
	}

	return (
		<Select value={selectValue} onValueChange={handleChange}>
			<SelectTrigger className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{allowClear && (
					<SelectItem value={CLEAR_SENTINEL}>{clearLabel}</SelectItem>
				)}
				{options.filter(Boolean).map((opt) => (
					<SelectItem key={opt} value={opt}>
						{opt}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
