import { ApolloServer } from 'apollo-server';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { buildSchema } from 'type-graphql';
import { RecipeResolver } from './graphql/recipe.resolver';


export const runPlayground = async () => {
    const schema = await buildSchema({
        resolvers: [RecipeResolver],
    });

    const server = new ApolloServer({
        schema,
        // tracing: true,
        // turn on cache headers
        cacheControl: true,
        // add in-memory cache plugin
        plugins: [responseCachePlugin()],
    });

    const { url } = await server.listen(4000);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
};
