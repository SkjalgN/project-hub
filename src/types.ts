export type ProjectStatus = 'active' | 'wip' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  liveUrl: string;
  repoUrl: string;
  tags: string[];
}
