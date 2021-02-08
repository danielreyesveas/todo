import { createContext, useContext, useState } from "react";

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
	const [showSidebar, setShowSidebar] = useState(false);
	const [showAddProject, setShowAddProject] = useState(false);
	const [showEditProject, setShowEditProject] = useState(false);
	const [showAddTask, setShowAddTask] = useState(false);
	const [showEditTask, setShowEditTask] = useState(false);

	const values = {
		showSidebar,
		setShowSidebar,
		showAddProject,
		setShowAddProject,
		showEditProject,
		setShowEditProject,
		showAddTask,
		setShowAddTask,
		showEditTask,
		setShowEditTask,
	};

	return <UIContext.Provider value={values}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);