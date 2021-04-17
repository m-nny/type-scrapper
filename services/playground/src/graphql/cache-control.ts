import { CacheHint, CacheScope } from 'apollo-cache-control';
import { UseMiddleware } from 'type-graphql';

export function CacheControl(hint: CacheHint) {
    return UseMiddleware(({ info }, next) => {
        console.log('Called CacheControl', hint);
        info.cacheControl.setCacheHint(hint);
        return next();
    });
}
