const rules = {
	user: {
			static: [],
	},
	admin: {
			static: [
					"drawer-admin-items:view",
					"tickets-manager:showall",
					"user-modal:editProfile",
					"user-modal:editQueues",
					"user-table:editTricked",
					"ticket-options:deleteTicket",
					"ticket-options:transferWhatsapp",
					"contacts-page:deleteContact",
			],
	},
	superuser: {
			static: [
					"drawer-admin-items:view",
					"tickets-manager:showall",
					"user-modal:editProfile",
					"user-modal:editQueues",
					"user-table:editTricked",
					"ticket-options:deleteTicket",
					"ticket-options:transferWhatsapp",
					"contacts-page:deleteContact",
					// Regras específicas para superuser
					"superuser-dashboard:access",
					"settings:modify",
					"advanced-reports:view",
			],
	},
};

export default rules;
