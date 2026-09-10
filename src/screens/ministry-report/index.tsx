import AppHeader from "@components/AppHeader";
import { ThemedView } from "@components/ThemedView";
import { ScreenNames } from "..";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "@components/ThemedText";
import { Colors } from "@theme/colors";
import { useTheme } from "@contexts/ThemeContext";
import { ClipboardListIcon } from "../../svg/clipboard";
import { AppSelect } from "@components/AppSelect";
import { InfoIcon } from "../../svg/info";
import { AppTextInput } from "@components/AppTextInput";
import { AppDatePicker } from "@components/AppDatePicker";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IReport,
  RootStackParamList,
  submitCellReportRequest,
} from "@declared-types/index";
import { PhotoFilmIcon } from "../../svg/photo-film";
import AppUploadFile from "@components/AppUploadFile";
import { useEffect, useState } from "react";
import { AppButton } from "@components/AppButton";
import { useAuth } from "@contexts/AuthContext";
import { useGetCellReports, useSubmitCellReport } from "@hooks/useReport";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  formatDate,
  formatMonthYearDate,
  formatToAMPM,
  groupReportByDay,
  isCurrentMonthAndYear,
} from "@utils/time";
import { PlusIcon } from "../../svg/plus";

const MinistryReportScreen = () => {
  const [reports, setReports] = useState<Record<string, IReport[]>>({});
  const { colorScheme } = useTheme();
  const { profile } = useAuth();

  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { mutate, isPending } = useGetCellReports({
    onSuccess(res) {
      console.log("Reports: ", res);
      setReports(groupReportByDay(res.data));
    },
    onFailed(err) {
      console.log("Error: ", err);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  return (
    <ThemedView style={[styles.container]}>
      <AppHeader currentScreen={ScreenNames.MINISTRYREPORTSSCREEN} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        <View style={styles.contentContainer}>
          <View style={[styles.headerContainer]}>
            <View style={[styles.headerContent]}>
              <ThemedText
                type="title"
                style={[{ color: Colors[colorScheme].primary }]}
              >
                Submitted Reports
              </ThemedText>
              <ThemedText>
                Track status, export records, and manage filings
              </ThemedText>
            </View>
            <View style={[styles.headerButton]}>
              <TouchableOpacity
                onPress={() => navigate(ScreenNames.SUBMITREPORTSCREEN)}
                style={[
                  {
                    backgroundColor: Colors[colorScheme].primary,
                    borderRadius: 999,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  },
                ]}
              >
                <PlusIcon color={"#FFF"} />
                <ThemedText>New Report</ThemedText>
              </TouchableOpacity>
              {/* <AppButton
                  icon={<ClipboardListIcon />}
                  title="New Report"
                  style={[{ borderRadius: 999, paddingVertical: 0 }]}
                /> */}
            </View>
          </View>
          <View style={[styles.cardContainer]}>
            <View
              style={[
                styles.card,
                { backgroundColor: Colors[colorScheme].card },
              ]}
            >
              <ThemedText style={[styles.cardHeader]}>Filled</ThemedText>
              <View style={[styles.cardContent]}>
                <ThemedText
                  type="title"
                  style={[styles.cardContentTitle, { color: "#00296E" }]}
                >
                  18
                </ThemedText>
                {/* <View style={[styles.cardIndicator]} /> */}
              </View>
              <ThemedText
                style={[
                  styles.cardFooter,
                  { color: Colors[colorScheme].muted },
                ]}
              >
                Total
              </ThemedText>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: Colors[colorScheme].card },
              ]}
            >
              <ThemedText style={[styles.cardHeader]}>Approved</ThemedText>
              <View style={[styles.cardContent]}>
                <ThemedText
                  type="title"
                  style={[
                    styles.cardContentTitle,
                    { color: Colors[colorScheme].primary },
                  ]}
                >
                  14
                </ThemedText>
                <View
                  style={[
                    styles.cardIndicator,
                    { backgroundColor: Colors[colorScheme].primary },
                  ]}
                />
              </View>
              <ThemedText
                style={[
                  styles.cardFooter,
                  { color: Colors[colorScheme].muted },
                ]}
              >
                Verified
              </ThemedText>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: Colors[colorScheme].card },
              ]}
            >
              <ThemedText style={[styles.cardHeader]}>In Review</ThemedText>
              <View style={[styles.cardContent]}>
                <ThemedText
                  type="title"
                  style={[styles.cardContentTitle, { color: "#7A2900" }]}
                >
                  3
                </ThemedText>
                <View
                  style={[
                    styles.cardIndicator,
                    {
                      backgroundColor: Colors[colorScheme].warning,
                    },
                  ]}
                />
              </View>
              <ThemedText style={[styles.cardFooter, { color: "#7A2900" }]}>
                Pending
              </ThemedText>
            </View>
            <View
              style={[
                styles.card,
                { backgroundColor: Colors[colorScheme].card },
              ]}
            >
              <ThemedText style={[styles.cardHeader]}>Drafts</ThemedText>
              <View style={[styles.cardContent]}>
                <ThemedText
                  type="title"
                  style={[styles.cardContentTitle, { color: "#747783" }]}
                >
                  0
                </ThemedText>
              </View>
              <ThemedText style={[styles.cardFooter, { color: "#747783" }]}>
                Unsent
              </ThemedText>
            </View>
          </View>
          <View style={[{ gap: 20 }]}>
            {Object.entries(reports).map(([date, report]) => (
              <View style={[styles.reportCardCotainer]} key={date}>
                <View style={[styles.reportDateGroupContainer]}>
                  <View style={[styles.reportDateGroup]}>
                    {isCurrentMonthAndYear(date) && (
                      <>
                        <ThemedText
                          style={[
                            styles.thisMonth,
                            { textTransform: "uppercase" },
                          ]}
                        >
                          This Month
                        </ThemedText>
                        <View
                          style={[
                            styles.dateDivider,
                            { backgroundColor: Colors[colorScheme].muted },
                          ]}
                        />
                      </>
                    )}
                    <ThemedText
                      style={[styles.date, { textTransform: "uppercase" }]}
                    >
                      {formatMonthYearDate(new Date(date))}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.reportCount]}>
                    {report.length} {report.length > 1 ? "Reports" : "Report"}
                  </ThemedText>
                </View>
                {report.map((r, i) => (
                  <View
                    key={i}
                    style={[
                      styles.reportDetailsCard,
                      {
                        backgroundColor: Colors[colorScheme].card,
                        borderColor: Colors[colorScheme].border,
                        marginBottom: 5,
                      },
                    ]}
                  >
                    <View style={[styles.reportDetailsHeader]}>
                      <View>
                        <ThemedText type="title" style={[styles.reportTitle]}>
                          {r.cellMeeting}
                        </ThemedText>
                        <ThemedText style={[styles.reportSubtitle]}>
                          {r.cell.title}
                        </ThemedText>
                      </View>
                      <View
                        style={[
                          styles.reportStatusContainer,
                          r.status === "pending" && {
                            backgroundColor:
                              Colors[colorScheme].statusPendingBackground,
                          },
                        ]}
                      >
                        <ThemedText
                          style={[
                            styles.reportStatus,
                            r.status === "pending" && {
                              color: Colors[colorScheme].statusPending,
                            },
                          ]}
                        >
                          {r.status}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={[styles.cardDetails]}>
                      <View style={[styles.cardCont]}>
                        <ThemedText>
                          {r.attendance}{" "}
                          {Number(r.attendance) > 1 ? "Attendees" : "Attendee"}
                        </ThemedText>
                      </View>
                      <View>
                        <ThemedText>{r.offering} offering</ThemedText>
                      </View>
                      <View>
                        <ThemedText>{r.firstTimer} first-timers</ThemedText>
                      </View>
                    </View>
                    <View style={[styles.reportDateGroupContainer]}>
                      <View style={[styles.reportDateGroup]}>
                        <ThemedText style={[styles.thisMonth]}>
                          {formatDate(new Date(r.createdAt))}
                        </ThemedText>
                        <View
                          style={[
                            styles.dateDivider,
                            { backgroundColor: Colors[colorScheme].muted },
                          ]}
                        />
                        <ThemedText style={[styles.date]}>
                          {formatToAMPM(new Date(r.createdAt))}
                        </ThemedText>
                      </View>
                      <ThemedText style={[styles.reportCount]}>
                        2 Reports
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};
export default MinistryReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 200,
  },
  headerContainer: {
    // paddingRight: 80,
    flexDirection: "row",
  },
  headerContent: {
    // flex: 1,
    width: "65%",
  },
  headerButton: {
    // width: 10,
  },
  cardContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    gap: 6,
  },

  card: {
    width: Dimensions.get("screen").width / 4 - 15,
    height: Dimensions.get("screen").width / 4 - 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  cardHeader: {
    fontFamily: "Montserrat-Medium",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cardContentTitle: {
    fontSize: 32,
  },
  cardIndicator: {
    height: 10,
    width: 10,
    borderRadius: 100,
  },
  cardFooter: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  button: {
    flex: 1,
  },
  reportCardCotainer: {},
  reportDateGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  reportDateGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  thisMonth: {
    // width: "auto",
  },
  date: {
    width: "auto",
  },
  reportCount: {},
  dateDivider: {
    height: 5,
    width: 5,
    borderRadius: 100,
  },
  reportDetailsCard: {
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  reportDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reportTitle: {
    fontSize: 18,
  },
  reportSubtitle: {},
  reportStatusContainer: {
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 999,
  },
  reportStatus: {
    textTransform: "capitalize",
    width: "100%",
    fontFamily: "Montserrat-Medium",
  },
  cardDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCont: {},
});
