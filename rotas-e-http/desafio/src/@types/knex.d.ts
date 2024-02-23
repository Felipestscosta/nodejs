// eslint-disable-next-line
import { Knex } from 'kenx'

declare module 'knex/types/tables'{
    export interface Tables{
        users: {
            id: string,
            name: string,
            avatar_url: string
        },
        snacks: {
            id: string,
            name: string,
            description: string,
            date: string,
            hour: number,
            diet_include: boolean,
            user_id: string,
            created_at: string
        }
    }
}