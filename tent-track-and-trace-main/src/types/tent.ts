
export type TentStatus = 'good' | 'needs-repair' | 'missing-items';

export interface Tent {
  id: string;
  name: string;
  model: string;
  capacity: number;
  status: TentStatus;
  condition: string;
  lastInspected: string;
  missingItems: string[];
  damagedItems: string[];
  location: string;
}
