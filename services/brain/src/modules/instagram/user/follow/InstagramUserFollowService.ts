import { singleton } from 'tsyringe';
import { Connection } from 'typeorm';
import { defaultListPage, TListPage, TListPageResult } from '../../../common/type';
import { InstagramUserFollow, InstagramUserFollowRepository } from './InstagramUserFollow';

@singleton()
export class InstagramUserFollowService {
    private repository: InstagramUserFollowRepository;
    public constructor(connection: Connection) {
        this.repository = connection.getRepository(InstagramUserFollow);
    }
    public add(follower: string, followee: string) {
        const follow = this.repository.create({ followerUsername: follower, followeeUsername: followee });
        return this.repository.save(follow);
    }
    public addManyFollowees(follower: string, followees: string[]) {
        const follows = this.repository.create(
            followees.map((follows) => ({ followerUsername: follower, followeeUsername: follows })),
        );
        return this.repository.save(follows);
    }
    public addManyFollowers(followers: string[], followee: string) {
        const follows = this.repository.create(
            followers.map((follower) => ({ followerUsername: follower, followeeUsername: followee })),
        );
        return this.repository.save(follows);
    }
    public async getCouple(page: TListPage = defaultListPage): Promise<TListPageResult<InstagramUserFollow>> {
        const [items, totalCount] = await this.repository.findAndCount({
            ...page,
        });
        return { totalCount, items, askedPage: page };
    }
    public async getUserFollows(username: string): Promise<InstagramUserFollow[]> {
        return await this.repository.find({ where: { followerUsername: username } });
    }
}
