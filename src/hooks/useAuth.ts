import { apiResponse, loginRequest } from "@declared-types/index";
import AuthService from "@services/AuthService";
import { useMutation } from "@tanstack/react-query";
import {
  createMutationOptions,
  MutationCallbackType,
} from "@utils/mutationOptions";

export const useLogin = ({
  onSuccess,
  onFailed,
}: MutationCallbackType<apiResponse>) => {
  return useMutation({
    ...createMutationOptions<apiResponse, loginRequest>({
      onSuccess,
      onFailed,
    }),
    mutationFn: AuthService.login,
  });
};
