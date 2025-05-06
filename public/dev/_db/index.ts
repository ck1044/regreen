// 데이터베이스는 사용하지 않고 API만 사용
// MySQL 및 Drizzle 관련 설정, 로직은 모두 주석 처리

// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";
// import * as schema from "./schema";
// import { eq } from "drizzle-orm";

// MySQL 클라이언트 생성을 위한 함수 (주석 처리)
// export const createConnection = async () => {
//   // @ts-ignore: mysql2 타입 문제 무시
//   const connection = await mysql.createConnection({
//     host: "regreen.c7ieosiyc1x7.ap-northeast-2.rds.amazonaws.com",
//     user: "root",
//     password: "regreen123!",
//     database: "regreen",
//     port: 3306,
//     ssl: {
//       rejectUnauthorized: true
//     }
//   });
//
//   return drizzle(connection, { schema, mode: "default" });
// };

// 데이터베이스 클라이언트 인스턴스 생성 (주석 처리)
// let dbInstance: any;

// API 설정
export const API_CONFIG = {
  // API 기본 URL
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  
  // 기본 헤더
  headers: {
    "Content-Type": "application/json",
  },
  
  // 타임아웃 설정 (밀리초)
  timeout: 10000,
};

// API 래퍼 함수
export const getAPI = async () => {
  // API 호출용 래퍼 함수
  return {
    callApi: async (endpoint: string, method: string = 'GET', data?: any) => {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
          method,
          headers: API_CONFIG.headers,
          body: data ? JSON.stringify(data) : undefined,
        });
        
        return await response.json();
      } catch (error) {
        console.error(`API 호출 오류 (${endpoint}):`, error);
        throw error;
      }
    }
  };
};

export default getAPI; 