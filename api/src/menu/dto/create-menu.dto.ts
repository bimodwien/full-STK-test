import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: 'Name of the menu item' })
  @IsString()
  name: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  parentId: number | null;
}
