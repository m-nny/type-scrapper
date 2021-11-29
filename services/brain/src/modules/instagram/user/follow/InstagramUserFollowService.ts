import { singleton } from 'tsyringe';
import { Connection } from 'typeorm';
import { defaultListPage, TListPage, TListPageResult } from '../../../common/type';
import { InstagramUserFollow, InstagramUserFollowRepository } from './InstagramUserFollow';
import { TInstagramUserFollowerCount, TInstagramUserFollowerCountList } from './types';

@singleton()
export class InstagramUserFollowService {
    private repository: InstagramUserFollowRepository;
    public constructor(connection: Connection) {
        this.repository = connection.getRepository(InstagramUserFollow);
    }
    public add(follower: string, followee: string) {
        const follow = this.repository.create({ followingUsername: follower, followedUsername: followee });
        return this.repository.save(follow);
    }
    public addManyFollowees(followingUsername: string, followedUsernames: string[]) {
        const follows = this.repository.create(
            followedUsernames.map((followedUsername) => ({ followingUsername, followedUsername })),
        );
        return this.repository.save(follows);
    }
    public addManyFollowers(followingUsernames: string[], followedUsername: string) {
        const follows = this.repository.create(
            followingUsernames.map((followingUsername) => ({ followingUsername, followedUsername })),
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
        return await this.repository.find({ where: { followingUsername: username } });
    }
    public async getUserFollowedBy(username: string): Promise<InstagramUserFollow[]> {
        return await this.repository.find({ where: { followedUsername: username } });
    }
    public async getMostFollowedNotImportedUsers(page: TListPage): Promise<TInstagramUserFollowerCountList> {
        const items: TInstagramUserFollowerCount[] = await this.repository.query(
            `
            SELECT
                "followeeUsername" as username,
                id,
                COUNT(*) as "followersCount"
            FROM instagram_user_follow
            LEFT JOIN instagram_user
            ON "followeeUsername" = username
            WHERE "id" IS NULL
            GROUP BY "followeeUsername", "id"
            ORDER BY "followersCount" DESC, "username" ASC
            LIMIT $1
            OFFSET $2
        `,
            [page.take, page.skip],
        );
        return { totalCount: items.length, items, askedPage: page };
    }
}
