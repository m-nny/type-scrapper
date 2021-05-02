import AdminBroExpress from '@admin-bro/express';
import * as TypeOrmAdapter from '@admin-bro/typeorm';
import AdminBro from 'admin-bro';
import { Express } from 'express';
import { DependencyContainer } from 'tsyringe';
import { BaseEntity, Column, Connection, Entity, getConnection, PrimaryGeneratedColumn } from 'typeorm';
import { ConfigWrapper } from '../../config';

@Entity()
export class Person extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ type: 'varchar' })
    public firstName!: string;

    @Column({ type: 'varchar' })
    public lastName!: string;

    // @ManyToOne(type => CarDealer, carDealer => carDealer.cars)
    // organization: Organization;

    // // in order be able to fetch resources in admin-bro - we have to have id available
    // @RelationId((person: Person) => person.organization)
    // organizationId: number;
}

AdminBro.registerAdapter(TypeOrmAdapter);
export const useAdminBro = async (container: DependencyContainer, app: Express, connection: Connection) => {
    const { config } = container.resolve(ConfigWrapper);
    const adminBro = new AdminBro({
        databases: [connection],
        // resources: [{ resource: Person, options: { parent: { name: 'foobar' } } }],
        rootPath: config.adminPanel.endpoint,
    });
    const router = AdminBroExpress.buildRouter(adminBro);
    app.use(adminBro.options.rootPath, router);
    return router;
};
