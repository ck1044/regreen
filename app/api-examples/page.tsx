'use client';

import { useState } from 'react';
import apiClient from '@/lib/api';
import { UserRole } from '@/lib/api';

export default function ApiExamplesPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 예제
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.auth.signin({
        email: 'test@example.com',
        password: 'password123'
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 예제
  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.auth.signup({
        email: 'newuser@example.com',
        password: 'password123',
        name: '홍길동',
        phoneNumber: '010-1234-5678',
        role: 'CUSTOMER' as UserRole
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 가게 목록 조회 예제
  const handleGetStores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.store.getAll();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '가게 목록 조회 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 알림 목록 조회 예제
  const handleGetNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.notification.getAll();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알림 목록 조회 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 프로필 조회 예제
  const handleGetProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.user.getProfile();
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 조회 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 예제
  const handleLogout = () => {
    apiClient.auth.signout();
    setResult({ message: '로그아웃 되었습니다.' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API 호출 예제</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">인증 API</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleLogin}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              로그인
            </button>
            <button 
              onClick={handleSignup}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={loading}
            >
              회원가입
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={loading}
            >
              로그아웃
            </button>
          </div>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">데이터 조회 API</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleGetStores}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              disabled={loading}
            >
              가게 목록
            </button>
            <button 
              onClick={handleGetNotifications}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              disabled={loading}
            >
              알림 목록
            </button>
            <button 
              onClick={handleGetProfile}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              disabled={loading}
            >
              프로필 조회
            </button>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="my-4 p-4 border rounded bg-gray-100">
          <p className="text-center">로딩 중...</p>
        </div>
      )}
      
      {error && (
        <div className="my-4 p-4 border rounded bg-red-100">
          <h2 className="font-semibold text-red-700">오류 발생</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="my-4 p-4 border rounded bg-green-50">
          <h2 className="font-semibold mb-2">응답 결과</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-80">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 