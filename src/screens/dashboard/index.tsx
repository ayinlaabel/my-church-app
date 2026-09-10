import { AppButton } from "@components/AppButton";
import { ThemedText } from "@components/ThemedText";
import { ThemedView } from "@components/ThemedView";
import { useAuth } from "@contexts/AuthContext";
import { useTheme, useThemeColor } from "@contexts/ThemeContext";
import { Colors } from "@theme/colors";
import { StyleSheet, View } from "react-native";
import { MoneyBill } from "../../svg/money-bill";
import AppHeader from "@components/AppHeader";
import { ScreenNames } from "..";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@declared-types/index";

const DashboardScreen = () => {
  const { colorScheme } = useTheme();
  const { profile } = useAuth();

  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <ThemedView style={[styles.container]}>
      <AppHeader currentScreen={ScreenNames.DASHBOARDSCREEN} />
      <View style={[styles.contentContainer]}>
        <ThemedText type="title" style={[styles.contentTitle]}>
          Welcome back, {profile?.firstName ?? "Guest"}
        </ThemedText>
        <ThemedText>Here is your household overview for the year.</ThemedText>
        <View style={[styles.contentButtonContainer]}>
          <View style={[styles.contentButton]}>
            <AppButton
              title="Give Now"
              onPress={() => console.log("Pressed")}
            />
          </View>
          <View style={[styles.contentButton]}>
            <AppButton
              variant="outline"
              title="Submit Report"
              onPress={() => navigate(ScreenNames.SUBMITREPORTSCREEN)}
            />
          </View>
        </View>
        <View style={[{ gap: 10 }]}>
          <View
            style={[
              styles.cardContainer,
              { borderWidth: 1, borderColor: Colors[colorScheme].border },
            ]}
          >
            <View style={[styles.cardContentContainer]}>
              <View style={[styles.cardContentHeader]}>
                <ThemedText style={[styles.cardContentTitle]}>
                  Annual Giving
                </ThemedText>
                <ThemedText style={[styles.cardContentSubtitle]}>
                  {new Date().getFullYear()}
                  {" YTD"}
                </ThemedText>
              </View>
              <View style={[styles.cardContentFooter]}>
                <ThemedText style={[styles.cardContentAmount]}>
                  $4,250.00
                </ThemedText>
                <ThemedText style={[styles.cardContentPercentage]}>
                  15% vs last year
                </ThemedText>
              </View>
            </View>
            <View style={[styles.cardIconContainer]}></View>
          </View>
          <View
            style={[
              styles.cardContainer,
              { borderWidth: 1, borderColor: Colors[colorScheme].border },
            ]}
          >
            <View style={[styles.cardContentContainer]}>
              <View style={[styles.cardContentHeader]}>
                <ThemedText style={[styles.cardContentTitle]}>
                  Active Pledge
                </ThemedText>
                <ThemedText style={[styles.cardContentSubtitle]}>
                  Building Funds
                </ThemedText>
              </View>
              <View style={[styles.cardContentFooter]}>
                <ThemedText style={[styles.cardContentAmount]}>
                  $4,250.00
                </ThemedText>
                <ThemedText style={[styles.cardContentPercentage]}>
                  15% vs last year
                </ThemedText>
              </View>
            </View>
            <View style={[styles.cardIconContainer]}></View>
          </View>
        </View>
        <View>
          <View style={[styles.recentHeader]}>
            <ThemedText type="title" style={[styles.recentTitle]}>
              Recent Activity
            </ThemedText>
            <ThemedText style={[styles.recentSubtitle]}>View all</ThemedText>
          </View>
          <View>
            <View
              style={[
                styles.transCard,
                { borderWidth: 1, borderColor: Colors[colorScheme].border },
              ]}
            >
              <View style={[styles.transCardContentContainer]}>
                <View
                  style={[
                    styles.transCardIconContainer,
                    { backgroundColor: Colors[colorScheme].iconBackground },
                  ]}
                >
                  <MoneyBill
                    color={useThemeColor(
                      { light: "#000", dark: "#fff" },
                      "text",
                    )}
                  />
                </View>
                <View style={[styles.transCardContent]}>
                  <ThemedText style={[styles.transCardTitle]}>
                    Monthly Tithe
                  </ThemedText>
                  <ThemedText style={[styles.transCardDate]}>
                    Oct 10, 2026
                  </ThemedText>
                </View>
              </View>
              <View style={[styles.transCardAmountContainer]}>
                <ThemedText style={[styles.transCardAmount]}>
                  $250.00
                </ThemedText>
                <View
                  style={[
                    styles.transCardStatusContainer,
                    {
                      backgroundColor:
                        Colors[colorScheme].statusVerifiedBackground,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.transCardStatus,
                      { color: Colors[colorScheme].statusVerified },
                    ]}
                  >
                    Verified{" "}
                  </ThemedText>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.transCard,
                { borderWidth: 1, borderColor: Colors[colorScheme].border },
              ]}
            >
              <View style={[styles.transCardContentContainer]}>
                <View
                  style={[
                    styles.transCardIconContainer,
                    { backgroundColor: Colors[colorScheme].iconBackground },
                  ]}
                >
                  <MoneyBill
                    color={useThemeColor(
                      { light: "#000", dark: "#fff" },
                      "text",
                    )}
                  />
                </View>
                <View style={[styles.transCardContent]}>
                  <ThemedText style={[styles.transCardTitle]}>
                    Monthly Tithe
                  </ThemedText>
                  <ThemedText style={[styles.transCardDate]}>
                    Oct 10, 2026
                  </ThemedText>
                </View>
              </View>
              <View style={[styles.transCardAmountContainer]}>
                <ThemedText style={[styles.transCardAmount]}>
                  $250.00
                </ThemedText>
                <View
                  style={[
                    styles.transCardStatusContainer,
                    {
                      backgroundColor:
                        Colors[colorScheme].statusPendingBackground,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.transCardStatus,
                      { color: Colors[colorScheme].statusPending },
                    ]}
                  >
                    Pending
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 50,
  },
  rightContainer: {},
  leftContainer: {},
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  menuOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  menu: {
    width: "82%",
    maxWidth: 320,
    paddingTop: 56,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuTitle: {
    fontSize: 24,
  },
  closeButton: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  menuGreeting: {
    marginTop: 8,
    color: Colors.light.muted,
  },
  menuItems: {
    gap: 4,
    marginTop: 32,
  },
  menuItem: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  contentTitle: {},
  contentSubtitle: {},
  contentButtonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginVertical: 20,
  },
  contentButton: {
    flex: 1,
  },
  cardContentHeader: {},
  cardContentFooter: {},
  cardContainer: {
    height: 162,
    width: "100%",
    padding: 16,
    borderRadius: 10,
  },
  cardContentContainer: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    height: "100%",
  },
  cardContentTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
  },
  cardContentSubtitle: {},
  cardContentAmount: {
    fontFamily: "Montserrat-Bold",
    fontSize: 28,
  },
  cardContentPercentage: {},
  cardIconContainer: {},
  transCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 5,
  },
  transCardContentContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  transCardContent: {},
  transCardIconContainer: {
    height: 30,
    width: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  transCardTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  transCardDate: {
    fontSize: 12,
  },
  transCardAmountContainer: {
    alignItems: "flex-end",
    width: "auto",
    flex: 1,
    flexShrink: 0,
  },
  transCardAmount: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    width: "auto",
  },
  transCardStatusContainer: {
    paddingHorizontal: 10,
    // paddingVertical: 3,
    borderRadius: 999,
  },
  transCardStatus: {
    fontSize: 12,
    fontFamily: "Montserrat-SemiBold",
    textTransform: "uppercase",
  },
  recentHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  recentTitle: {
    fontSize: 16,
  },
  recentSubtitle: {
    fontSize: 12,
  },
});
