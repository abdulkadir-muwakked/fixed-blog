/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "next" {
  export interface PageProps {
    params: { [key: string]: string | string[] };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}
