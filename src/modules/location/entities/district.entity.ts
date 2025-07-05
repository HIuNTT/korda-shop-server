import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Province } from './province.entity';

@Entity()
export class District extends CommonEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  provinceId: number;

  @ManyToOne(() => Province, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  province: Province;
}
