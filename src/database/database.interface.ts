export interface IDatabaseConfigAttributes {
  storage?: string;
  dialect?: string;
  logging?: boolean;
}

export interface IDatabaseConfig {
  local: IDatabaseConfigAttributes;
}
