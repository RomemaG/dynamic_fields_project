import { DataSource } from 'typeorm';
import { Project } from '../entities/Project';
import { CustomField } from '../entities/CustomField';
import { FieldValue } from '../entities/FieldValue';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'custom_fields_db',
    synchronize: false, 
    logging: false, 
    entities: [Project, CustomField, FieldValue],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: [],
    timezone: '+00:00',
    charset: 'utf8mb4',
});

// Initialize connection
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully with TypeORM');
    } catch (error) {
        console.error(' Database connection failed:', error);
        throw error;
    }
};