import { menu, menuItem } from "@declared-types/index";
import { ScreenNames } from "@screens/index";

export const mainModule: menuItem[] = [
  {
    name: "Dashboard",
    screenName: ScreenNames.DASHBOARDSCREEN,
    isLive: true,
  },
  {
    name: "Household",
    screenName: ScreenNames.HOUSEHOLDSCREEN,
    isLive: false,
  },
  {
    name: "Giving & Pledges",
    screenName: ScreenNames.GIVINGPLEDGESSCREEN,
    isLive: false,
  },
  {
    name: "Proof Submission",
    screenName: ScreenNames.PROOFSUBMISSIONSCREEN,
    isLive: false,
  },
  {
    name: "Ministry Reports",
    screenName: ScreenNames.MINISTRYREPORTSSCREEN,
    isLive: true,
  },
];

export const community: menuItem[] = [
  {
    name: "Ministries & Groups",
    screenName: ScreenNames.MINISTRIESGROUPSCREEN,
    isLive: false,
  },
  {
    name: "Committees",
    screenName: ScreenNames.COMMITTEESSCREEN,
    isLive: false,
  },
  {
    name: "Announcements",
    screenName: ScreenNames.ANNOUNCEMENTSSCREEN,
    isLive: false,
  },
];

export const menuList: menu[] = [
  {
    name: "Main Modules",
    items: mainModule,
  },
  {
    name: "Community & Governance",
    items: community,
  },
];
