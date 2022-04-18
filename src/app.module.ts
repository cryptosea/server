import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule as _ } from './env/env.module';
import { NFTModule } from './nft/nft.module';
import { Web3Module } from './web3/web3.module';
import { MfsModule } from './mfs/mfs.module';

@Module({
  imports: [
    ..._.forRoot(),
    MfsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',

      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: ~~process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),

      synchronize: _.MODE !== 'production',
      logging: _.MODE !== 'production',
      autoLoadEntities: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      playground: _.MODE !== 'production',
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    NFTModule.forRoot({
      confirmation: ~~_.envs.WEB3_CRYPTOSEA_CONFIRMATION_,
    }),
    Web3Module.forRoot({
      provider: _.envs.WEB3_PROVIDER_URL_,
      secretKey: _.envs.WEB3_SECRET_KEY_,
      contractAddr: {
        cryptosea: _.envs.WEB3_CRYPTOSEA_CONTADDR_.toLowerCase(),
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
