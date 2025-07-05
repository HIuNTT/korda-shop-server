import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { District } from './district.entity';

@Entity()
export class Ward extends CommonEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  districtId: number;

  @ManyToOne(() => District, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  district: District;
}
