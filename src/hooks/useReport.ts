import { apiResponse, submitCellReportRequest } from "@declared-types/index";
import AuthService from "@services/AuthService";
import ReportService from "@services/ReportService";
import { useMutation } from "@tanstack/react-query";
import {
  createMutationOptions,
  MutationCallbackType,
} from "@utils/mutationOptions";

export const useSubmitCellReport = ({
  onSuccess,
  onFailed,
}: MutationCallbackType<apiResponse>) => {
  return useMutation({
    ...createMutationOptions<apiResponse, submitCellReportRequest>({
      onSuccess,
      onFailed,
    }),
    mutationFn: ReportService.submitCellReport,
  });
};
export const useGetCellReports = ({
  onSuccess,
  onFailed,
}: MutationCallbackType<apiResponse>) => {
  return useMutation({
    ...createMutationOptions<apiResponse, null>({
      onSuccess,
      onFailed,
    }),
    mutationFn: ReportService.getAllCellReport,
  });
};
