export class HttpRequestParams {
    baseUrl?: string | undefined;
    controller?: string | undefined;
    routes?: string[] | undefined;
    headers?: { [key: string]: string } | undefined;
    body?: any | undefined;
    queryStrings?: { [key: string]: string | number | boolean | null } | undefined;
    withCredentials: boolean = false;
}