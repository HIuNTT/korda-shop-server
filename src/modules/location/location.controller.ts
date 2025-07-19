import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { BypassTimeout } from '#/common/decorators/bypass-timeout.decorator';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { LocationQuery } from './location.dto';
import { Ward } from './entities/ward.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleType } from '#/constants/role.constant';

@ApiTags('Location - Địa điểm theo đơn vị hành chính Việt Nam')
@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @ApiOperation({ summary: 'Lấy danh sách các tỉnh thành' })
  @Public()
  @Get('province')
  async getProvinces(): Promise<Province[]> {
    return await this.locationService.getProvinces();
  }

  @ApiOperation({ summary: 'Lấy danh sách các quận, huyện theo mã tỉnh' })
  @Public()
  @Get('district')
  async getDistrictsByProvinceId(@Query() query: LocationQuery): Promise<District[]> {
    return await this.locationService.getDistrictsByProvinceId(query.code);
  }

  @ApiOperation({ summary: 'Lấy danh sách các phường, xã theo mã quận, huyện' })
  @Public()
  @Get('ward')
  async getWardsByDistrictId(@Query() query: LocationQuery): Promise<Ward[]> {
    return await this.locationService.getWardsByDistrictId(query.code);
  }

  @ApiOperation({
    summary: 'Chèn dữ liệu địa điểm từ file Excel',
    description: 'Chỉ admin mới có quyền import dữ liệu',
  })
  @ApiBearerAuth()
  @Roles(RoleType.ADMIN)
  @BypassTimeout()
  @Post('insert-data')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async insertData(@UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.locationService.insertData(file);
  }
}
