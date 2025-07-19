import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Excel from 'exceljs';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';
import { District } from './entities/district.entity';
import { Ward } from './entities/ward.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Province) private readonly provinceRepository: Repository<Province>,
    @InjectRepository(District) private readonly districtRepository: Repository<District>,
    @InjectRepository(Ward) private readonly wardRepository: Repository<Ward>,
  ) {}

  async getProvinces(): Promise<Province[]> {
    return await this.provinceRepository.find({
      order: { code: 'ASC' },
      select: ['id', 'name', 'code'],
    });
  }

  async getDistrictsByProvinceId(provinceId: number): Promise<District[]> {
    return await this.districtRepository.find({
      where: { provinceId },
      order: { code: 'ASC' },
      select: ['id', 'name', 'code'],
    });
  }

  async getWardsByDistrictId(districtId: number): Promise<Ward[]> {
    return await this.wardRepository.find({
      where: { districtId },
      order: { code: 'ASC' },
      select: ['id', 'name', 'code'],
    });
  }

  async insertData(file: Express.Multer.File): Promise<void> {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.worksheets[0];
    const rows = worksheet.getSheetValues().slice(2);

    const provinces = new Map<string, number>();
    const districts = new Map<string, number>();

    for (const row of rows) {
      const provinceName = row[1];
      const provinceCode = row[2];
      const districtName = row[3];
      const districtCode = row[4];
      const wardName = row[5];
      const wardCode = row[6];

      if (!provinceCode || !districtCode || !wardCode) continue;

      // Handle province
      let provinceId: number;
      if (!provinces.has(provinceCode)) {
        const province = await this.provinceRepository.save({
          name: provinceName,
          code: provinceCode,
        });
        provinceId = province.id;
        provinces.set(provinceCode, provinceId);
      } else {
        provinceId = provinces.get(provinceCode);
      }

      // Handle district
      let districtId: number;
      if (!districts.has(districtCode)) {
        const entity = new District();
        entity.name = districtName;
        entity.code = districtCode;
        entity.provinceId = provinceId;

        const district = await this.districtRepository.save(entity);
        districtId = district.id;
        districts.set(districtCode, districtId);
      } else {
        districtId = districts.get(districtCode);
      }

      // Handle ward
      await this.wardRepository.save({
        name: wardName,
        code: wardCode,
        districtId: districtId,
      });
    }
  }
}
