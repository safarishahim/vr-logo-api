import { ApiProperty } from "@nestjs/swagger";
import { Column, SortBy } from "nestjs-paginate/lib/helper";

export class PaginatedDto<TDATA = any> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  sortBy: SortBy<TDATA>;

  @ApiProperty()
  searchBy: Column<TDATA>[];

  @ApiProperty()
  search: string;

  @ApiProperty()
  filter?: {
    [column: string]: string | string[];
  };

  results: TDATA[];
}