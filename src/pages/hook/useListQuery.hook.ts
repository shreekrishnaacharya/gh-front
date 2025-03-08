import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { IPage, PageResponse } from "../../common/interface";
import { GridSortModel, DataGridProps } from "@mui/x-data-grid"; // Importing necessary types
import { SortDirection } from "../../common/common.enum";

interface QueryParams extends IPage {
  page: number;
  pageSize: number;
}

interface ListQueryProps {
  resource: string;
  getList: (params?: QueryParams) => Promise<PageResponse<any>>;
}

// Typing the return value of useListQuery to be compatible with DataGridProps
export const useListQuery = ({ resource, getList }: ListQueryProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters from the URL
  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const queryParams: Partial<QueryParams> = {};

    params.forEach((value, key) => {
      if (key === "page" || key === "pageSize") {
        queryParams[key] = Number(value);
      } else {
        queryParams[key] = value;
      }
    });

    return queryParams;
  }, [location.search]);

  // Set query params based on the URL
  const [queryParams, setQueryParams] = useState<Partial<QueryParams>>(
    getQueryParams()
  );

  useEffect(() => {
    setQueryParams(getQueryParams());
  }, [location.search]);

  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery(
    [resource, queryParams],
    () => getList(queryParams as QueryParams),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  // Function to update the URL query parameters
  const updateQueryParams = useCallback(
    (newParams: Partial<QueryParams>) => {
      const params = new URLSearchParams(location.search);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined) {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });
      navigate({
        pathname: location.pathname,
        search: params.toString(),
      });
    },
    [location.search, navigate]
  );

  const handleSortModelChange = (newModel: GridSortModel) => {
    const { field, sort } = newModel[0] ?? {};
    updateQueryParams({
      _sort: field,
      _order: sort == "asc" ? SortDirection.ASC : SortDirection.DESC,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    updateQueryParams({ pageSize: newPageSize });
  };

  const setFilter = (
    filters: { field: string; value: string | number | boolean }[]
  ) => {
    filters.forEach((filter) => {
      updateQueryParams({ [filter.field]: filter.value });
    });
  };

  // Return the typed DataGridProps
  const dataGridProps: Partial<DataGridProps> = {
    rowCount: response?.totalElements ?? 0,
    rows: response?.elements ?? [],
    loading: isLoading,
    paginationMode: "server",
    sortingMode: "server",
    onSortModelChange: handleSortModelChange,
    paginationModel: {
      page: queryParams.page ?? 0,
      pageSize: queryParams.pageSize ?? 10,
    },
    onPaginationModelChange: (newPaginationModel) => {
      const { page, pageSize } = newPaginationModel;
      updateQueryParams({ page, pageSize });
    },
  };

  return {
    dataGridProps,
    queryParams,
    isLoading,
    refetch,
    setFilter,
  };
};
