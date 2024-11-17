import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Records } from '../../admin/record/entities/record.entity';
import { RecordDto } from "./dto/record..dto";

export class RecordService {
    constructor(
        @InjectRepository(Records)
        private readonly recordRepository: Repository<Records>,
    ) {}

    async getAllRecords(): Promise<Records[]> {
        try {
            const records = await this.recordRepository.find();
            console.log('Fetched all records:', records);
            return records;
        } catch (error) {
            console.error('Failed to get all activity record:', error.message);
        }
    }

    async saveRecord(recordDto: RecordDto ): Promise<Records> {
        try {
            console.log('Record Dto object:', recordDto);
            const newRecord = this.recordRepository.create({
                ...recordDto,
            });

            const saveRecord = await this.recordRepository.save(newRecord);
            console.log('New saving record:', saveRecord);
            
            return saveRecord;
        } catch (error) {
            console.error('Failed to save new record:', error.message);
        }
    }

    async getRecordById(recordId: number): Promise<Records | null> {
        const record = await this.recordRepository.findOne({
            where: { recordId },
        });
        
        if (!record) {
            throw new NotFoundException('Record not found');
        }
        console.log('Search record by recordId:', record);
        return record;
    }
}