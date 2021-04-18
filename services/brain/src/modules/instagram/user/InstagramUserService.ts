import { singleton } from 'tsyringe';
import { Connection } from 'typeorm';
import { TListPage, TListPageResult } from '../../common/type';
import { InstagramUser, InstagramUserCreateArg, InstagramUserKey, InstagramUserRepository } from './InstagramUser';

@singleton()
export class InstagramUserService {
    private repository: InstagramUserRepository;
    public constructor(connection: Connection) {
        this.repository = connection.getRepository(InstagramUser);
    }
    public get(key: InstagramUserKey): Promise<InstagramUser | undefined> {
        return this.repository.findOne(key);
    }
    public async getCouple(page: TListPage): Promise<TListPageResult<InstagramUser>> {
        const [items, totalCount] = await this.repository.findAndCount(page);
        return { totalCount, items, askedPage: page };
    }
    public create(dto: InstagramUserCreateArg): Promise<InstagramUser> {
        const item = this.repository.create(dto);
        return this.repository.save(item);
    }
}
