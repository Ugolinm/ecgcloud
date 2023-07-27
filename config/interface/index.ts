export interface ConfigOptionsDatabase {
  host: string,
  port: number,
  user: string,
  password: string,
  database: string
}
export interface ConfigOptionsHttp {
  port?: number;
  cors?: any;
  public_path?: string;
}
export interface ConfigOptionsServer {
  http?: ConfigOptionsHttp;
  required_fields?: string[];
  access_frequency?: number;
  userinfo_expire?: number;
}

export interface ConfigOptionsDirs {
  cache?: string;
  dat?: string;
  image?: string;
  report?: string;
}

export interface ConfigOptions {
  log_category: string; // dev...
  database: ConfigOptionsDatabase;
  server: ConfigOptionsServer;
  dirs: ConfigOptionsDirs;
}