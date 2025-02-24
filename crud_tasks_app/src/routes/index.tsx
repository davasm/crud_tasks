import Link from "next/link";

export const AppRoutes = () => {
	return (
		<div>
			<nav>
				<ul>
					<li>
						<Link href="/create">Create</Link>
					</li>
					<li>
						<Link href="/home">Tasks</Link>
					</li>
				</ul>
			</nav>
			{/* Aqui você pode renderizar as páginas conforme necessário */}
		</div>
	);
};
