import { ScreenNames } from "@screens/index";

export type IconProps = {
  height?: number;
  width?: number;
  color?: string;
};
export type RootStackParamList = {
  LoginScreen: undefined;
  DashboardScreen: undefined;
  HouseHoldScreen: undefined;
  GivingPledgesScreen: undefined;
  ProofSubmissionScreen: undefined;
  MinistryReportsScreen: undefined;
  MinistriesGroupScreen: undefined;
  CommitteesScreen: undefined;
  AnnouncementsScreen: undefined;
  SubmitReportScreen: undefined;
};

export type loginRequest = {
  email: string;
  password: string;
};

export type submitCellReportRequest = {
  cellId: string;
  reportDate: string;
  attendance: string;
  firstTimer: string;
  newConvert: string;
  holdOn: string;
  offering: string;
};

export type apiResponse = {
  success: boolean;
  status: string;
  StatusCode: number;
  message: string;
  data: any;
};

export type menu = {
  name: string;
  items: menuItem[];
};

export type menuItem = {
  name: string;
  screenName: keyof RootStackParamList;
  icon?: any;
  isLive: boolean;
};

export type AppHeaderProps = {
  currentScreen: string;
};

export type IProfile = {
  address: string;
  birthday: string;
  canLoginViaKC: boolean;
  cell: any;
  cellLeader: any;
  centre: Centre;
  createdAt: string;
  department: any;
  email: string;
  firstName: string;
  gender: string;
  hasFinishedFoundationSchool: boolean;
  id: string;
  isBaptized: boolean;
  isBornAgain: boolean;
  kingschatDetails: any;
  kingschatUsername: string;
  lastName: string;
  maritalStatus: string;
  pcf: Pcf;
  pcfLeader: PcfLeader;
  phoneNumber: string;
  profilePicture: string;
  services: any[];
  updatedAt: string;
};

export type Centre = {
  createdAt: string;
  id: string;
  title: string;
  updatedAt: string;
};

export type Pcf = {
  createdAt: string;
  id: string;
  title: string;
  type: string;
  updatedAt: string;
};

export type PcfLeader = {
  createdAt: string;
  id: string;
  title: string;
  type: string;
  updatedAt: string;
};

export type IReport = {
  attendance: string;
  cell: Pcf;
  cellMeeting: string;
  createdAt: string;
  firstTimer: string;
  holdOn: string;
  id: string;
  newConvert: string;
  offering: string;
  updatedAt: string;
  status: string;
};
