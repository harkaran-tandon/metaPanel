import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Headers = Record<string, string> | undefined;

export function useFetchData(apiUrl: string, headers?: Headers) {
  return useQuery({
    queryKey: [apiUrl],
    queryFn: async () => {
      const res = await fetch(apiUrl, { headers });
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },
    enabled: !!apiUrl,
  });
}

export function useCreateData(apiUrl: string, headers?: Headers) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newData: any) => {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(newData),
      });
      if (!res.ok) throw new Error("Failed to create data");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiUrl] });
    },
  });
}

export function useUpdateData(apiUrl: string, headers?: Headers) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const url = `${apiUrl}/${id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update data");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiUrl] });
    },
  });
}

export function useDeleteData(apiUrl: string, headers?: Headers) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = `${apiUrl}/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Failed to delete data");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiUrl] });
    },
  });
}
