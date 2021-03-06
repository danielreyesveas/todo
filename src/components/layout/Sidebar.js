import { useState } from "react";
import {
	FaChevronDown,
	FaInbox,
	FaRegCalendarAlt,
	FaRegCalendar,
} from "react-icons/fa";

import AddProject from "../AddProject";
import Projects from "../Projects";

import { connect } from "react-redux";
import { setProject } from "../../redux/actions/dataActions";

const Sidebar = ({ selectedProject, setProject }) => {
	const [active, setActive] = useState("inbox");
	const [showProjects, setShowProjects] = useState(true);

	return (
		<div className="sidebar" data-testid="sidebar">
			<ul className="sidebar__generic">
				<li className={active === "inbox" ? "active" : undefined}>
					<div
						data-testid="inbox"
						onClick={() => {
							setActive("inbox");
							setProject("INBOX");
						}}
						onKeyDown={() => {
							setActive("inbox");
							setProject("INBOX");
						}}
						tabIndex={0}
						role="button"
					>
						<span>
							<FaInbox />
						</span>
						<span>Inbox</span>
					</div>
				</li>
				<li className={active === "today" ? "active" : undefined}>
					<div
						data-testid="today"
						aria-label="Show today's tasks"
						onClick={() => {
							setActive("today");
							setProject("TODAY");
						}}
						onKeyDown={() => {
							setActive("today");
							setProject("TODAY");
						}}
						tabIndex={0}
						role="button"
					>
						<span>
							<FaRegCalendar />
						</span>
						<span>Today</span>
					</div>
				</li>
				<li className={active === "next_7" ? "active" : undefined}>
					<div
						data-testid="next_7"
						aria-label="Show tasks for the next 7 days"
						onClick={() => {
							setActive("next_7");
							setProject("NEXT_7");
						}}
						onKeyDown={() => {
							setActive("next_7");
							setProject("NEXT_7");
						}}
						tabIndex={0}
						role="button"
					>
						<span>
							<FaRegCalendarAlt />
						</span>
						<span>Next 7 days</span>
					</div>
				</li>
				<div
					className="sidebar__middle"
					aria-label="Show/hide projects"
					onClick={() => setShowProjects(!showProjects)}
					onKeyDown={() => setShowProjects(!showProjects)}
					tabIndex={0}
					role="button"
				>
					<span>
						<FaChevronDown
							className={
								!showProjects ? "hidden-projects" : undefined
							}
						/>
					</span>
					<h2>Projects</h2>
				</div>

				<ul className="sidebar__projects">
					{showProjects && <Projects />}
				</ul>
			</ul>
			{showProjects && <AddProject />}
		</div>
	);
};

const mapStateToProps = (state) => ({
	selectedProject: state.data.selectedProject,
});

const mapActionsToProps = {
	setProject,
};
export default connect(mapStateToProps, mapActionsToProps)(Sidebar);
