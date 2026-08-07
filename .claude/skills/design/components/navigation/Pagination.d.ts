export interface PaginationProps {
  page?: number;
  pages?: number;
  onPage?: (page: number) => void;
  className?: string;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
