/// <reference types="next" />
/// <reference types="next/types/global" />

declare module "next" {
  export interface PageProps {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[]>;
  }
}
