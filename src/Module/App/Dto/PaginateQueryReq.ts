import { ApiProperty } from "@nestjs/swagger";

export class PaginateQueryReq {
  @ApiProperty({
    required: false
  })
  page?: number;

  @ApiProperty({
    required: false
  })
  limit?: number;

  @ApiProperty({
    required: false,
  })
  sortBy?: string;

  @ApiProperty({
    required: false
  })
  searchBy?: string;

  @ApiProperty({
    required: false
  })
  search?: string;

  @ApiProperty({
    required: false
  })
  filter?: Record<string, any>;

  @ApiProperty({
    required: false
  })
  path: string;
}