import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import clsx from "clsx";

import {
  Collapse,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  //ListSubheader,
  makeStyles,
} from "@material-ui/core";

import {
  AccountTreeOutlined,
  Code,
  ContactPhoneOutlined,
  DashboardOutlined,
  DeveloperModeOutlined,
  LocalOffer,
  MenuBook,
  PeopleAltOutlined,
  QuestionAnswerOutlined,
  SettingsOutlined,
  SyncAlt,
  VpnKeyRounded,
  WhatsApp,
  EmojiFlagsRounded,
  ViewArray,
  ExpandLess,
  ExpandMore
} from "@material-ui/icons";

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.secondary.main,
  },
  li: {
    backgroundColor: theme.palette.menuItens.main,
  },
  sub: {
    backgroundColor: theme.palette.sub.main,
  },
  divider: {
    backgroundColor: theme.palette.divide.main,
    margin: theme.spacing(1, 0),
  },
  activeItem: {
    color: theme.palette.primary.main,
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.hover,
    "& .MuiListItemText-primary": {
      color: theme.palette.primary.main,
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
  },
  listItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  listItemText: {
  display: "flex",
  alignItems: "center",
}

}));

function ListItemLink(props) {
  const { icon, primary, to, className } = props;
  const classes = useStyles();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li className={classes.li}>
      <ListItem button component={renderLink} className={className}>
        {icon ? (
          <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
        ) : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const MainListItems = (props) => {
  const { drawerClose } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const classes = useStyles();
  const location = useLocation(); // Aqui pegamos o location corretamente

const isActive = (path) => {
  if (path === "/" || path === "/api") {
    return location.pathname === path;
  }
  return location.pathname.startsWith(path);
};
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open); // Alterna o estado de abertura
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  return (
    <div onClick={drawerClose}>
      <ListItemLink
        to="/"
        primary="Dashboard"
        icon={<DashboardOutlined />}
        className={clsx(classes.listItem, isActive("/") && classes.activeItem)}
      />
      <ListItemLink
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        icon={<WhatsApp />}
        className={clsx(
          classes.listItem,
          isActive("/tickets") && classes.activeItem
        )}
      />
      <ListItemLink
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        icon={<ContactPhoneOutlined />}
        className={clsx(
          classes.listItem,
          isActive("/contacts") && classes.activeItem
        )}
      />
      <ListItemLink
        to="/quickAnswers"
        primary={i18n.t("mainDrawer.listItems.quickAnswers")}
        icon={<QuestionAnswerOutlined />}
        className={clsx(
          classes.listItem,
          isActive("/quickAnswers") && classes.activeItem
        )}
      />
      <ListItemLink
        to="/tags"
        primary={i18n.t("mainDrawer.listItems.tags")}
        icon={<LocalOffer />}
        className={clsx(
          classes.listItem,
          isActive("/tags") && classes.activeItem
        )}
      />
      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider className={classes.divider} />
            {/* <ListSubheader inset className={classes.sub}>
              {i18n.t("mainDrawer.listItems.administration")}
            </ListSubheader> */}
            <ListItemLink
              to="/campaign"
              primary={i18n.t("mainDrawer.listItems.campaign")}
              icon={<EmojiFlagsRounded />}
              className={clsx(
                classes.listItem,
                isActive("/campaign") && classes.activeItem
              )}
            />
            <ListItemLink
              to="/connections"
              primary={i18n.t("mainDrawer.listItems.connections")}
              icon={
                <Badge
                  badgeContent={connectionWarning ? "!" : 0}
                  color="error"
                  overlap="rectangular"
                >
                  <SyncAlt />
                </Badge>
              }
              className={clsx(
                classes.listItem,
                isActive("/connections") && classes.activeItem
              )}
            />
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<PeopleAltOutlined />}
              className={clsx(
                classes.listItem,
                isActive("/users") && classes.activeItem
              )}
            />
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTreeOutlined />}
              className={clsx(
                classes.listItem,
                isActive("/queues") && classes.activeItem
              )}
            />
            <ListItemLink
              to="/Integrations"
              primary={i18n.t("mainDrawer.listItems.integrations")}
              icon={<DeveloperModeOutlined />}
              className={clsx(
                classes.listItem,
                isActive("/Integrations") && classes.activeItem
              )}
            />
            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlined />}
              className={clsx(
                classes.listItem,
                isActive("/settings") && classes.activeItem
              )}
            />

            {/* Item principal "API" */}

            <ListItem
              button
              onClick={handleClick}
              className={clsx(classes.listItem)}
              style={{ padding: 0, margin: 0 }}
            >
              <ListItemLink
                to="#"
                primary={i18n.t("mainDrawer.listItems.apititle")}
                icon={<Code />}
              />
              <>
                {open ? (
                  <ExpandLess style={{ marginLeft: 8, padding: 2 }} />
                ) : (
                  <ExpandMore style={{ marginLeft: 8, padding: 2 }} />
                )}
              </>
            </ListItem>

            {/* Lista de subitens */}
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemLink
                  to="/api"
                  primary={i18n.t("mainDrawer.listItems.api")}
                  icon={<ViewArray />}
                  className={clsx(
                    classes.listItem,
                    isActive("/api") && classes.activeItem
                  )}
                />
                <ListItemLink
                  to="/apidocs"
                  primary={i18n.t("mainDrawer.listItems.apidocs")}
                  icon={<MenuBook />}
                  className={clsx(
                    classes.listItem,
                    isActive("/apidocs") && classes.activeItem
                  )}
                />
                <ListItemLink
                  to="/apikey"
                  primary={i18n.t("mainDrawer.listItems.apikey")}
                  icon={<VpnKeyRounded />}
                  className={clsx(
                    classes.listItem,
                    isActive("/apikey") && classes.activeItem
                  )}
                />
              </List>
            </Collapse>
          </>
        )}
      />
    </div>
  );
};

export default MainListItems;
