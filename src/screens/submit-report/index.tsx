import AppHeader from "@components/AppHeader";
import { ThemedView } from "@components/ThemedView";
import { ScreenNames } from "..";
import { ScrollView, StyleSheet, View } from "react-native";
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
  RootStackParamList,
  submitCellReportRequest,
} from "@declared-types/index";
import { KeyboardAvoidingView } from "@components/KeyboardAvoidingView";
import { PhotoFilmIcon } from "../../svg/photo-film";
import AppUploadFile from "@components/AppUploadFile";
import { useEffect, useState } from "react";
import { AppButton } from "@components/AppButton";
import { useAuth } from "@contexts/AuthContext";
import { useSubmitCellReport } from "@hooks/useReport";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const SubmitReportScreen = () => {
  const [reportType, setReportType] = useState<string>("");
  const [cell, setCell] = useState<string>("");
  const [cells, setCells] = useState<{ label: string; value: string }[]>([]);
  const { colorScheme } = useTheme();
  const { profile } = useAuth();

  const { navigate } = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (profile?.cell) {
      setCells((prev) => [
        { label: profile.cell.title, value: profile.cell.id },
      ]);

      setCell(profile.cell.id);
      setValue("cellId", profile.cell.id);
    }
  }, []);
  const { control, handleSubmit, setValue, getValues, formState } =
    useForm<submitCellReportRequest>({
      defaultValues: {
        cellId: "",
        reportDate: "",
        offering: "",
        newConvert: "",
        firstTimer: "",
        holdOn: "",
        attendance: "",
      },
      mode: "all",
    });

  const { mutate, isPending } = useSubmitCellReport({
    onSuccess(res) {
      console.log("success", res);
      navigate(ScreenNames.DASHBOARDSCREEN);
    },
    onFailed(err) {
      console.log("failed: ", JSON.stringify(err));
    },
  });

  const onSubmit: SubmitHandler<submitCellReportRequest> = (values) => {
    console.log("values: ", values);
    mutate(values);
  };
  return (
    <ThemedView style={[styles.container]}>
      <AppHeader currentScreen={ScreenNames.MINISTRYREPORTSSCREEN} />
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
          <View style={[styles.contentContainer]}>
            <View style={[styles.headerContainer]}>
              <ThemedText
                type="title"
                style={[{ color: Colors[colorScheme].primary }]}
              >
                Report Submission
              </ThemedText>
              <ThemedText>
                Please fill out the details for your recent gathering.
              </ThemedText>
            </View>
            <View
              style={[
                styles.cardContainer,
                {
                  backgroundColor: Colors[colorScheme].card,
                  borderColor: Colors[colorScheme].border,
                },
              ]}
            >
              <View style={[styles.cardHeader]}>
                <ClipboardListIcon
                  height={20}
                  width={20}
                  color={Colors[colorScheme].primary}
                />
                <ThemedText
                  type="title"
                  style={[
                    styles.cardTitle,
                    { color: Colors[colorScheme].primary },
                  ]}
                >
                  Select Template
                </ThemedText>
              </View>
              <AppSelect
                options={[
                  { label: "Cell Report", value: "cell-report" },
                  { label: "Church Report", value: "church-report" },
                ]}
                value={reportType}
                onValueChange={(e) => setReportType(e)}
              />
            </View>
            {reportType === "cell-report" && (
              <>
                <View
                  style={[
                    styles.cardContainer,
                    {
                      backgroundColor: Colors[colorScheme].card,
                      borderColor: Colors[colorScheme].border,
                    },
                  ]}
                >
                  <View style={[styles.cardHeader]}>
                    <InfoIcon
                      height={20}
                      width={20}
                      color={Colors[colorScheme].primary}
                    />
                    <ThemedText
                      type="title"
                      style={[
                        styles.cardTitle,
                        { color: Colors[colorScheme].primary },
                      ]}
                    >
                      Report Details
                    </ThemedText>
                  </View>
                  <View style={{ gap: 20 }}>
                    <AppSelect
                      options={cells}
                      placeholder="Select Cell"
                      onValueChange={(e) => {
                        setCell(e);
                        setValue("cellId", e);
                      }}
                      value={cell}
                      disabled={cell ? true : false}
                    />
                    <AppTextInput
                      control={control}
                      name="attendance"
                      label="Attendance Count"
                      placeholder="Total Attendance"
                    />
                    <AppTextInput
                      control={control}
                      name="firstTimer"
                      label="Number of First-Timer"
                      placeholder="Total Number of First-Timer"
                    />
                    <AppTextInput
                      control={control}
                      name="newConvert"
                      label="Number of New Convert"
                      placeholder="Total Number of New Converts"
                    />
                    <AppTextInput
                      name="offering"
                      label="Offering"
                      placeholder="Offering Amount"
                      control={control}
                    />
                    <AppDatePicker
                      control={control}
                      name="holdOn"
                      label="Report Date"
                      placeholder="Select report date"
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.cardContainer,
                    {
                      backgroundColor: Colors[colorScheme].card,
                      borderColor: Colors[colorScheme].border,
                    },
                  ]}
                >
                  <View style={[styles.cardHeader]}>
                    <PhotoFilmIcon
                      height={20}
                      width={20}
                      color={Colors[colorScheme].primary}
                    />
                    <ThemedText
                      type="title"
                      style={[
                        styles.cardTitle,
                        { color: Colors[colorScheme].primary },
                      ]}
                    >
                      Attachments
                    </ThemedText>
                  </View>
                  <View style={{ gap: 20 }}>
                    <AppUploadFile />
                  </View>
                </View>
                <View style={[styles.buttonContainer]}>
                  <View style={[styles.button]}>
                    <AppButton
                      variant="outline"
                      title="Save Draft"
                      onPress={() => {}}
                      disabled={isPending}
                    />
                  </View>
                  <View style={[styles.button]}>
                    <AppButton
                      loading={isPending}
                      title="Submit Report"
                      onPress={handleSubmit(onSubmit)}
                      disabled={isPending}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};
export default SubmitReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  headerContainer: {
    paddingRight: 80,
  },
  cardContainer: {
    padding: 20,
    borderWidth: 1,
    // borderColor: "#D9E2EC",
    // backgroundColor: "#FFF",
    borderRadius: 15,
    marginVertical: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  button: {
    flex: 1,
  },
});
