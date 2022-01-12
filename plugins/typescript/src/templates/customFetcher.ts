import { camel, pascal } from "case";

/**
 * Get custom fetcher template
 */
export const getCustomFetcher = (prefix: string, contextPath: string) =>
  `import qs from "qs";
import { ${pascal(prefix)}Context } from "./${contextPath}";

export type ${pascal(
    prefix
  )}FetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
} & ${pascal(prefix)}Context["fetcherOptions"];

export async function ${camel(prefix)}Fetch<
  TData,
  TBody extends {} | undefined,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {}
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
}: ${pascal(prefix)}FetcherOptions<
  TBody,
  THeaders,
  TQueryParams,
  TPathParams
>): Promise<TData> {
  const response = await window.fetch(
    resolveUrl(url, queryParams, pathParams),
    {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

const resolveUrl = (
  url: string,
  queryParams: Record<string, unknown> = {},
  pathParams: Record<string, string> = {}
) => {
  let query = qs.stringify(queryParams);
  if (query) query = \`?\${query}\`;
  return url.replace(/\\{\\w*\\}/g, (key) => pathParams[key.slice(1, -1)]) + query;
};
`;
