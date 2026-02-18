/**
 * Rule types and interfaces for email automation
 */

export type ConditionType = 'sender' | 'subject' | 'body' | 'hasAttachment';
export type ConditionOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'notContains';
export type ActionType = 'moveToFolder' | 'markAsRead' | 'delete' | 'addLabel' | 'markAsUnread';
export type LogicalOperator = 'AND' | 'OR';

export interface RuleCondition {
  type: ConditionType;
  operator: ConditionOperator;
  value: string;
}

export interface RuleAction {
  type: ActionType;
  value?: string; // folder name, label name, etc.
}

export interface Rule {
  id: string;
  accountId: string;
  name: string;
  description?: string;
  conditions: RuleCondition[];
  logicalOperator: LogicalOperator; // How to combine multiple conditions
  actions: RuleAction[];
  enabled: boolean;
  priority: number; // Lower number = higher priority
  createdAt: string;
  updatedAt: string;
}

export interface CreateRuleDTO {
  accountId: string;
  name: string;
  description?: string;
  conditions: RuleCondition[];
  logicalOperator: LogicalOperator;
  actions: RuleAction[];
  enabled?: boolean;
  priority?: number;
}

export interface UpdateRuleDTO {
  name?: string;
  description?: string;
  conditions?: RuleCondition[];
  logicalOperator?: LogicalOperator;
  actions?: RuleAction[];
  enabled?: boolean;
  priority?: number;
}

// Log types
export type ActionStatus = 'success' | 'error' | 'skipped';

export interface ActionLog {
  id: string;
  ruleId: string;
  ruleName: string;
  accountEmail: string;
  emailId: string;
  emailSubject: string;
  emailFrom: string;
  action: ActionType;
  actionValue?: string;
  status: ActionStatus;
  errorMessage?: string;
  timestamp: string;
}

export interface CreateActionLogDTO {
  ruleId: string;
  ruleName: string;
  accountEmail: string;
  emailId: string;
  emailSubject: string;
  emailFrom: string;
  action: ActionType;
  actionValue?: string;
  status: ActionStatus;
  errorMessage?: string;
}

// Statistics
export interface RuleStats {
  ruleId: string;
  ruleName: string;
  totalExecutions: number;
  successCount: number;
  errorCount: number;
  lastExecuted?: string;
}

export interface AccountStats {
  accountId: string;
  accountEmail: string;
  totalRules: number;
  activeRules: number;
  emailsProcessedToday: number;
  lastProcessed?: string;
}
