export enum TASK_STATUS {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export enum PRIORITY {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class Task {
  id: string;
  title: string;
  description: string;
  status: TASK_STATUS;
  priority: PRIORITY;
  creatorId: string;
  assigneeIds: string[];
  comments: Comment[];
  created_at: Date;
  udpated_at: Date;
}
