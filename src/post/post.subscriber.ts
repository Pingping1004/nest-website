import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { Records } from '../admin/record/entities/record.entity'; // Adjust the path to the new Record entity
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/schema/user.entity';
import { Post } from '../post/schema/post.entity';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface {
    constructor(
        @InjectRepository(Records)
        private postRepository: Repository<Post>,
    ) {
        console.log('RecordSubscriber initialized');
    }

    listenTo(): Function | string {
        console.log('Subscriber listening to User and Post entities');
        return User;
    }

    // Record for INSERT operation
    async afterInsert(event: InsertEvent<any>) {
        try {
            console.log('Insert event triggered for:', event.entity); // Debug message
            const record = new Records();
            record.action = `INSERT_${event.metadata.tableName.toUpperCase()}`;
            record.date = new Date();
            record.entityId = event.entity.userId || event.entity.postId;

            await event.manager.save(Records, record);
            console.log('Insert record saved:', record);
        } catch (error) {
            console.error('Error during afterInsert:', error.message);
        }
    }

    // Record for UPDATE operation
    async afterUpdate(event: UpdateEvent<any>) {
        try {
            console.log('Update event triggered for:', event.entity); // Debug message
            const record = new Records();
            record.action = `UPDATE_${event.metadata.tableName.toUpperCase()}`;
            record.date = new Date();
            record.entityId = event.entity?.userId || event.entity?.postId;

            if (!record.entityId) {
                console.error('Entity ID is undefined. Skipping record creation.');
                return;
            }
            
            await event.manager.save(Records, record);
            console.log('Remove record saved:', record);
        } catch (error) {
            console.error('Error during afterUpdate:', error.message);
        }
    }

    // Record for REMOVE operation
    async afterRemove(event: RemoveEvent<any>) {
        try {
            console.log('Remove event triggered for:', event.entity); // Debug message
            const record = new Records();
            record.action = `REMOVE_${event.metadata.tableName.toUpperCase()}`;
            record.date = new Date();
            record.entityId = event.entity?.userId || event.entity?.postId;
            
            await event.manager.save(Records, record);
            console.log('Removed record saved:', record);
        } catch (error) {
            console.error('Error during afterRemove:', error.message);
        }
    }
}
