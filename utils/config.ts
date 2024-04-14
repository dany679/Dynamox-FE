let BASE_HTTP = process.env.NEXT_PUBLIC_HTTP || "http://localhost:8080";
if (process.env.NODE_ENV === "development") {
  BASE_HTTP = process.env.NEXT_BASE_HTTP_DEV ? process.env.NEXT_BASE_HTTP_DEV : BASE_HTTP;

} else {
  BASE_HTTP = process.env.NEXT_PUBLIC_HTTP!;
}
export const config = {
  BASE_HTTP,
  webTitle: "Fix Machines",
  DEFAULT_QUERY_LIMIT: 5,
};
