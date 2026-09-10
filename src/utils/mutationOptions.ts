import { QueryClient } from "@tanstack/react-query";
//import { ApiResponse } from "@declared-types/index";
import { handleAPIWithValidationErrors } from "./handleApiError";

export type MutationCallbackType<TData = unknown, TError = Error> = {
  onSuccess?: (data: TData) => void;
  onFailed?: (err: unknown) => void;
  errorMessage?: (title: string, description?: string) => void;
  invalidateKeys?: unknown[][];
  queryClient?: QueryClient;
};

export const createMutationOptions = <
  TData = unknown,
  TVariables = void,
  TContext = unknown,
>({
  onSuccess,
  onFailed,
  invalidateKeys,
  queryClient,
}: MutationCallbackType<TData, TVariables>) => {
  return {
    onError(error: Error) {
      handleAPIWithValidationErrors?.(error, onFailed);
    },
    onSuccess(data: TData) {
      if (queryClient && invalidateKeys) {
        invalidateKeys.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key }),
        );
      }
      onSuccess?.(data);
    },
  };
};
