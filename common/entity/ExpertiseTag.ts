/* eslint-disable import/no-cycle */
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExpertData } from './ExpertData';

@Entity()
export class ExpertiseTag {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({
        unique: true,
    })
    @Column()
    name: string;

    @ManyToMany((type) => ExpertData, (expertData) => expertData.expertiseTags)
    expertData: ExpertData[];
}
