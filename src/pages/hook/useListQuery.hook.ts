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
  pageSize?: number;
}

/**
 * useListQuery is a hook that fetches a list of items from a remote API, and
 * provides a set of props to render a DataGrid component. It takes care of
 * handling pagination, sorting, and filtering, as well as automatic re-fetching
 * of data when the URL changes.
 *
 * Props:
 * - `resource`: The name of the resource to fetch (e.g. "tasks")
 * - `getList`: A function that fetches a list of items from the remote API,
 *              given a set of query parameters
 * - `pageSize`: The number of items to fetch per page (default: 100)
 *
 * Returns:
 * - `dataGridProps`: A set of props to render a DataGrid component
 * - `queryParams`: The current query parameters
 * - `isLoading`: Whether the data is currently being fetched
 * - `refetch`: A function to re-fetch the data
 * - `setFilter`: A function to set a filter on the data
 */
export const useListQuery = ({
  resource,
  getList,
  pageSize = 100,
}: ListQueryProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters from the URL
  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const queryParams: Partial<QueryParams> = {
      _sort: "due_date",
      _order: SortDirection.DESC,
      _start: 0,
      _end: Number(pageSize),
    };

    params.forEach((value, key) => {
      if (key === "page" || key === "pageSize") {
        queryParams[key] = Number(value);
      } else {
        queryParams[key] = value;
      }
    });

    return queryParams;
  }, [location.search, pageSize]);

  // Set query params based on the URL
  const [queryParams, setQueryParams] = useState<Partial<QueryParams>>(
    getQueryParams()
  );

  useEffect(() => {
    setQueryParams(getQueryParams());
  }, [location.search, getQueryParams]);

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
    [location.search, navigate, location.pathname]
  );

  const handleSortModelChange = (newModel: GridSortModel) => {
    const { field, sort } = newModel[0] ?? {};
    updateQueryParams({
      _sort: field ?? "due_date",
      _order: sort === "asc" ? SortDirection.ASC : SortDirection.DESC,
    });
  };

  const setFilter = (
    filters: { field: string; value: string | number | boolean | any }[]
  ) => {
    filters.forEach((filter) => {
      updateQueryParams({ [filter.field]: filter.value });
    });
  };

  const dataGridProps: Partial<DataGridProps> = {
    rowCount: response?.totalElements ?? 0,
    rows: response?.elements ?? [],
    loading: isLoading,
    paginationMode: "server",
    sortingMode: "server",
    onSortModelChange: handleSortModelChange,
    onPaginationModelChange: (newPaginationModel) => {
      const { page, pageSize } = newPaginationModel;
      updateQueryParams({
        _start: Number(page) * Number(pageSize),
        _end: Number(page + 1) * Number(pageSize),
      });
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
