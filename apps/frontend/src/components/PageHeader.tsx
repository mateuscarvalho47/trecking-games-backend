import type { ReactNode } from "react";

type PageHeaderProps = {
	overline: string;
	title: string;
	subtitle?: ReactNode;
};

export function PageHeader({ overline, title, subtitle }: PageHeaderProps) {
	return (
		<header>
			<div className="page-overline">{overline}</div>
			<h1 className="text-[29px] font-semibold tracking-tight m-0 text-text-hi">
				{title}
			</h1>
			{subtitle && (
				<p className="text-text-md text-[14.5px] mt-1.5 mb-0">{subtitle}</p>
			)}
		</header>
	);
}
