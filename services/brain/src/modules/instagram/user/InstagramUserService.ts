import { singleton } from 'tsyringe';
import { Connection, IsNull } from 'typeorm';
import { defaultListPage, TListPageResult } from '../../common/type';
import { InstagramUser, InstagramUserCreateDTO, InstagramUserKey, InstagramUserRepository } from './InstagramUser';
import { GetCoupleInstagramUsersArgs } from './types';

@singleton()
export class InstagramUserService {
    private repository: InstagramUserRepository;
    public constructor(connection: Connection) {
        this.repository = connection.getRepository(InstagramUser);
    }
    public get(key: InstagramUserKey): Promise<InstagramUser | undefined> {
        return this.repository.findOne(key);
    }
    public getOrFail(key: InstagramUserKey): Promise<InstagramUser> {
        return this.repository.findOneOrFail(key);
    }
    public async getCouple({
        onlyNotImported = false,
        page = defaultListPage,
    }: GetCoupleInstagramUsersArgs): Promise<TListPageResult<InstagramUser>> {
        const [items, totalCount] = await this.repository.findAndCount({
            ...page,
            where: onlyNotImported ? { id: IsNull() } : undefined,
        });
        return { totalCount, items, askedPage: page };
    }
    public create(dto: InstagramUserCreateDTO): Promise<InstagramUser> {
        const item = this.repository.create(dto);
        return this.repository.save(item);
    }
    public createCouple(dto: InstagramUserCreateDTO[]): Promise<InstagramUser[]> {
        const item = this.repository.create(dto);
        return this.repository.save(item);
    }
    public createCoupleByUsernames(dto: InstagramUserCreateDTO[]): Promise<InstagramUser[]> {
        const item = this.repository.create(dto);
        return this.repository.save(item);
    }
}
