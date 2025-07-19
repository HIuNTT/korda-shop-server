import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Province extends CommonEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;
}
