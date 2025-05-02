'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup, UserRole, SignupRequest } from '@/auth/signup';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<SignupRequest>({
    email: '',
    password: '',
    role: 'CUSTOMER' as UserRole,
    name: '',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('회원가입 폼 제출:', formData);
      const result = await signup(formData);
      
      // 액세스 토큰 저장
      localStorage.setItem('accessToken', result.accessToken);
      console.log('회원가입 성공:', result);
      
      // 성공 메시지 표시
      setSuccess(true);
      
      // 3초 후 메인 페이지로 리다이렉트
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold">RE-GREEN</h1>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight">
            회원가입
          </h2>
        </div>
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            회원가입이 성공적으로 완료되었습니다. 메인 페이지로 이동합니다.
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium">
                전화번호
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="010-0000-0000"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium">
                회원 유형
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="CUSTOMER">일반 사용자</option>
                <option value="STORE_OWNER">상점 주인</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-75"
            >
              {isLoading ? '처리중...' : '가입하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 