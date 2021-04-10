import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class InstagramUser {
    @PrimaryColumn()
    public username!: string;

    @Column()
    public avatarUrl!: string;
}
