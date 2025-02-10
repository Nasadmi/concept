import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  async beforeRemove(event: RemoveEvent<UserEntity>): Promise<void> {
    return await event.manager.query('DELETE * FROM markmap WHERE userId = ?', [
      event.entity?.id,
    ]);
  }
}
