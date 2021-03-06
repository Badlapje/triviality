import { RecordWithPlayhead } from '@triviality/eventsourcing-redux/ReadModel/PlayheadRecord';
import { Map } from 'immutable';
import { User } from '../ValueObject/User';
import { UserId } from '../ValueObject/UserId';

export interface ChatStateInterface {
  users: Map<UserId, User>;
}

export const defaultChatState: ChatStateInterface = {
  users: Map<UserId, User>(),
};

export class ChatState extends RecordWithPlayhead<ChatStateInterface>(defaultChatState, 'ChatState') {
  public addUser(id: UserId, name: string): this {
    return this.setIn(['users', id], name);
  }
}
