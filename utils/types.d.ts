export interface IPagination {
  count: number;
  page: number;
  limit: number;
  next: boolean;
  skip?: number;
}
export interface IPaginationAccessPoint extends IPagination {
  search: string;
  state: string;
  serialID: string;
  next?: boolean;
}
export interface IPaginationRequest {
  page: number;
  limit: number;
  search?: string;
}
export const initialPagination: IPagination = {
  count: 1,
  page: 1,
  limit: 5,
  next: false,
};

// query params
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};
export type UrlQueriesParams = {
  params: string;
  values: {
    key: string;
    value: string | null;
  }[];
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
